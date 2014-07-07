<?php 
use org\sopen\app\api\filesystem\storage\StorageException;

class Addressbook_Controller_Print extends Tinebase_Controller_Abstract{
	const TYPE_MULTILETTER = 'multiLetter';
	
	const PROCESS_LETTER_FOR_CONTACTS = 'letterForContacts';
	const PROCESS_LETTER_FOR_CONTACT_IDS = 'letterForContactIds';
	const PROCESS_MULTILETTER = 'multiLetters';
	const PROCESS_EDITABLELETTER = 'editableLetter';
	const PROCESS_EDITABLE_LETTER_FOR_CONTACTS = 'editableLetterForContacts';
	
	
	/**
	 * config of courses
	 *
	 * @var Zend_Config
	 */
	protected $_config = NULL;
	private $pdfServer = null;
	private $printJobStorage = null;
	private $map = array();
	private $count = 0;
	private $isPreview = false;
	private $filters = array();
	private $textBlocks = array();
	private $contacts = null;
	private $additionalContactData = null;
	private $customTemplateCallbacks = array();

	/**
	 * the constructor
	 *
	 * don't use the constructor. use the singleton
	 */
	private function __construct() {
		$this->_applicationName = 'Addressbook';
		$this->_currentAccount = Tinebase_Core::getUser();
		$this->_contactController = Addressbook_Controller_Contact::getInstance();
		$this->_doContainerACLChecks = FALSE;
	}

	private static $_instance = NULL;

	/**
	 * the singleton pattern
	 *
	 * @return SoEventManager_Controller_SoEvent
	 */
	public static function getInstance()
	{
		if (self::$_instance === NULL) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}
	
	public function getPrintJobStorage(){
		return $this->printJobStorage;
	}
	
	public function setPreview($preview){
		$this->isPreview = $preview;
	}
	
	public function setFilters($filters){
		$this->filters = Zend_Json::decode($filters);
	}
	
	public function setTextBlocks(array $textBlocks){
		/*foreach($textBlocks as $name=> $value){
			$this->textBlocks[] = array(
				'name' => $name,
				'data' => $value
			);
		}*/
		$this->textBlocks = $textBlocks;
	}
	
	public function setContacts($contacts, $additionalData){
		$this->contacts = $contacts;
		$this->additionalContactData = $additionalData;
	}
	
public function setContactIds($contactIds, $additionalData){
		$this->contactIds = $contactIds;
		$this->additionalContactData = $additionalData;
	}
	
	public function printLetterForContacts($templateId, $contacts, $additionalData, $customTemplateCallbacks = null){
		if(!is_null($customTemplateCallbacks)){
			$this->customTemplateCallbacks = $customTemplateCallbacks;
		}
		$this->setContacts($contacts, $additionalData);
		$this->templateId = $templateId;
		$this->runTransaction(self::PROCESS_LETTER_FOR_CONTACTS);
	}
	
public function printLetterForContactIds($templateId, $contactIds, $additionalData, $customTemplateCallbacks = null){
		if(!is_null($customTemplateCallbacks)){
			$this->customTemplateCallbacks = $customTemplateCallbacks;
		}
		$this->setContactIds($contactIds, $additionalData);
		$this->templateId = $templateId;
		$this->runTransaction(self::PROCESS_LETTER_FOR_CONTACT_IDS);
	}
	
	public function printMultiLetter($filters, $templateId, $preview = false){
		$this->setPreview($preview);
		$this->setFilters($filters);
		$this->templateId = $templateId;
		$this->runTransaction(self::PROCESS_MULTILETTER);
	}
	
	public function printEditableLetter($filters, $templateId, $data){
		
		$this->setFilters($filters);
		if(is_string($data)){
			$data = Zend_Json::decode($data);
		}
		
		$this->setTextBlocks($data);
		$this->templateId = $templateId;
		$this->runTransaction(self::PROCESS_EDITABLELETTER);
	}
	
	public function printEditableLetterForContacts($templateId, $contacts, $additionalData, $textBlocks){
		$this->setContacts($contacts, $additionalData);
		
		if(is_string($textBlocks)){
			$textBlocks = Zend_Json::decode($textBlocks);
		}
		
		$this->setTextBlocks($textBlocks);
		$this->templateId = $templateId;
		$this->runTransaction(self::PROCESS_EDITABLE_LETTER_FOR_CONTACTS);
	}
	
	/**
	 * 
	 * get ids from request
	 */
	public function getIds(){
		if(array_key_exists('ids',$this->params)){
			return $this->params['ids'];
		}
		return null;
	}
	
	private function createLetterForContacts(){
		
		$this->createLetters($this->contacts);
	}
	
	private function createLetterForContactIds(){
		
		$this->createLetters($this->contactIds, false, true);
	}	
	
	private function createMultiLetter(){
		$pagination = array('sort' => 'n_family', 'dir' => 'ASC');
		$filters = new Addressbook_Model_ContactFilter($this->filters, 'AND');
		$contacts =  $this->_contactController->search($filters,new Tinebase_Model_Pagination($pagination));
		
		$this->createLetters($contacts);
	}
	
	private function createEditableLetter(){
		$pagination = array('sort' => 'n_family', 'dir' => 'ASC');
		$filters = new Addressbook_Model_ContactFilter($this->filters, 'AND');
		$contacts =  $this->_contactController->search($filters,new Tinebase_Model_Pagination($pagination));
		
		$this->createLetters($contacts);
	}
	
	private function createEditableLetterForContacts(){
		
		$this->createLetters($this->contacts);
	}	
	
	private function createLetters($contacts, $collected = false, $ids = false){
		$this->count += count($contacts);
		foreach($contacts as $contactRaw){
			if(!$ids){
				$contactId = $contactRaw->getId();
				$contact = $contactRaw;
			}else{
				$contact = Addressbook_Controller_Contact::getInstance()->get($contactRaw);
				$contactId = $contact->getId();
			}
			// get data for template from custom template
			//$replaceTextBlocks = $this->templateController->getTextBlocks($templateId);
			$replaceTextBlocks = $this->textBlocks;
			$user = Tinebase_Core::get(Tinebase_Core::USER);
			$userContact =  Addressbook_Controller_Contact::getInstance()->getContactByUserId($user->getId());
			
			$data = Addressbook_Custom_Template::getContactData(
				array(
					'contact' => $contact,
					'user' => Tinebase_Core::get(Tinebase_Core::USER),
					'userContact' => $userContact
				),
				$replaceTextBlocks
			);
			
			foreach($this->customTemplateCallbacks as $call){
				
				$call::replaceTextBlocks($this->additionalContactData[$contact->getId()], $replaceTextBlocks);
			}
			
			if(is_array($this->additionalContactData) && array_key_exists($contact->getId(), $this->additionalContactData)){
				$data = array_merge($data, $this->additionalContactData[$contact->getId()]);
			}
			
			$tempInFile = $this->tempFilePath . md5(serialize($contact).microtime()) . '_in.odt';
			$tempOutFile = $this->tempFilePath . md5(serialize($contact).microtime()) . '_out.odt';

			$this->templateController->renderTemplateToFile($this->templateId, $data, $tempInFile, $tempOutFile, $replaceTextBlocks);

			// move file into storage: cleans up tempfile at once
			$this->printJobStorage->moveIn( $tempOutFile,"//in/$contactId/multi/odt/letter");
			$inFile = $this->printJobStorage->resolvePath( "//in/$contactId/multi/odt/letter" );
			
			$outFile = $this->printJobStorage->getCreateIfNotExist( "//convert/$contactId/multi/pdf/letter" );
			
			$this->pdfServer->convertDocumentToPdf($inFile, $outFile);
			
			$this->map[] = $contactId;
		}

	}
	
	private function createResult(){
		$inputFiles = array();
		$pathMap = array();

		foreach($this->map as $contactId){
			if($this->printJobStorage->fileExists("//convert/$contactId/multi/pdf/letter")){
				$path = $this->printJobStorage->resolvePath( "//convert/$contactId/multi/pdf/letter" );
				if(!array_key_exists($path,$pathMap)){
					$inputFiles[] = $path;
					$pathMap[$path] = null;
				}
			}
		}	

		// give the final output file a name in the storage
		$outputFile = $this->printJobStorage->getCreateIfNotExist( "//out/result/Multi/Letter/pdf/final" );

		// merge the sorted input files to a multipage pdf
		$this->pdfServer->mergePdfFiles($inputFiles, $outputFile);
	}
	
	
	private function outputResult(){
		header('Content-Type: application/pdf');
		// get content from storage and close it (temporary storage gets deleted by this operation)
		$content = $this->printJobStorage->getFileContent("//out/result/Multi/Letter/pdf/final");
		//$this->printJobStorage->close();
		echo $content;
	}
	
	private function serveDownload(){
		$printFileName = 'Brief-'.strftime('%d.%m.%Y %H:%M:%S').'.pdf';
		header("Pragma: public");
        header("Cache-Control: max-age=0");
        header('Content-Disposition: attachment; filename='.$printFileName);
        header("Content-Description: Pdf Datei");  
      	header('Content-Type: application/pdf');
		echo $this->printJobStorage->getFileContent("//out/result/Multi/Letter/pdf/final");
	}
	
	private function outputNone(){
		$this->printJobStorage->close();
		echo 'Keine Dokumente fällig zum Druck!';
	}
	
	private function runTransaction($process){
		try{
			$config = \Tinebase_Config::getInstance()->getConfig('pdfserver', NULL, TRUE)->value;
			$storageConf = \Tinebase_Config::getInstance()->getConfig('printjobs', NULL, TRUE)->value;
			
    		$this->tempFilePath = CSopen::instance()->getCustomerPath().'/customize/data/documents/temp/';
			$this->templateController = DocManager_Controller_Template::getInstance();
			$db = Tinebase_Core::getDb();
			$tm = Tinebase_TransactionManager::getInstance();
			
			$this->pdfServer = org\sopen\app\api\pdf\server\PdfServer::getInstance($config)->
				setDocumentsTempPath(CSopen::instance()->getDocumentsTempPath());
			$this->printJobStorage =  org\sopen\app\api\filesystem\storage\TempFileProcessStorage::createNew(
				'printjobs', 
				$storageConf['storagepath']
			);

			$this->printJobStorage->addProcessLines(array('in','convert','out'));
			
			$tId = $tm->startTransaction($db);
			$serveTypeDownload = false;
			switch($process){
				
				case self::PROCESS_MULTILETTER:
					
					$this->createMultiLetter();
					break;
					
				case self::PROCESS_EDITABLELETTER:
					$serveTypeDownload = true;
					$this->createEditableLetter();
					break;
					
				case self::PROCESS_LETTER_FOR_CONTACTS:
					$serveTypeDownload = true;
					$this->createLetterForContacts();
					break;
					
				case self::PROCESS_EDITABLE_LETTER_FOR_CONTACTS:
					$serveTypeDownload = true;
					$this->createEditableLetterForContacts();
					break;
					
				case self::PROCESS_LETTER_FOR_CONTACT_IDS:
					$serveTypeDownload = true;
					$this->createLetterForContactIds();
					break;
					
			}
			
			// create the multipage output from single page input files
			if($this->count>0){
				$this->createResult();
			}
			// make db changes final
			$tm->commitTransaction($tId);
			
			// output the result
			if($this->count>0){
				if(!$serveTypeDownload){
					$this->outputResult();
				}else{
					$this->serveDownload();
				}
			}else{
				$this->outputNone();
			}
		}catch(Exception $e){
			echo $e->__toString();
			$tm->rollback($tId);
		}
	}
}
?>