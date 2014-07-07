<?php
/**
 * 
 * Enter description here ...
 * @author hhartl
 *
 */
class Addressbook_Controller_ContactPerson extends Tinebase_Controller_Record_Abstract
{
    /**
     * the salutation backend
     *
     * @var Addressbook_Backend_Salutation
     */
    protected $_backend;
           
    protected $_doContainerACLChecks = false;
	
    protected $_modlogActive = false;
	
    /**
     * holdes the instance of the singleton
     *
     * @var Addressbook_Controller_SoFeeCategory
     */
    private static $_instance = NULL;
        

    public static function getInstance() 
    {
        if (self::$_instance === NULL) {
            self::$_instance = new Addressbook_Controller_ContactPerson();
        }
        
        return self::$_instance;
    }
            
    /**
     * the constructor
     *
     * don't use the constructor. use the singleton 
     */
    private function __construct() {
    	$this->_applicationName = 'Addressbook';
		$this->_backend = new Addressbook_Backend_ContactPerson();
		$this->_modelName = 'Addressbook_Model_ContactPerson';
		$this->_currentAccount = Tinebase_Core::getUser();
		$this->_purgeRecords = FALSE;
		$this->_doContainerACLChecks = FALSE;
    }
    
    /**
     * don't clone. Use the singleton.
     *
     */
    private function __clone() 
    {        
    }
 
    /**
     * (non-PHPdoc)
     * @see Tinebase_Controller_Record_Abstract::search()
     */
    public function search(Tinebase_Model_Filter_FilterGroup $_filter = NULL, Tinebase_Model_Pagination $_pagination = NULL, $_onlyIds = FALSE){
    	// no ids searchable
    	// check if needed anywhere and modify if so
        $recordSet = parent::search($_filter,$_pagination,$_onlyIds);
    	if( ($recordSet instanceof Tinebase_Record_RecordSet) && ($recordSet->count()>0)){
    		$it = $recordSet->getIterator();
    		foreach($it as $key => $record){
				$this->appendDependentRecords($record);				
    		}
    	}
    	return $recordSet;
    }
    
    /**
     * Append contacts by foreign key (record embedding)
     * 
     * @param Tinebase_Record_Abstract $record
     * @return void
     */
    protected function appendDependentRecords($record){
      
    }
    /**
     * Get FundProject record by id (with embedded dependent contacts)
     * 
     * @param int $id
     */
    public function get($id, $_getDeleted = FALSE){
    	$record = parent::get($id, $_getDeleted);
    	$this->appendDependentRecords($record);
    	return $record;
    }
	
    /**
     * 
     * Enter description here ...
     * @param unknown_type $name
     */
    public function getIdByName($name){
    	return $this->_backend->getIdByProperty($name, 'name');
    }
    
    /**
     * 
     * Enter description here ...
     * @param unknown_type $_sort
     * @param unknown_type $_dir
     */
    public function getContactPersons($_sort = 'id', $_dir = 'ASC')
    {
        $result = $this->_backend->getAll($_sort, $_dir);

        return $result;    
    }
    
    /**
     * 
     * Enter description here ...
     * @param unknown_type $id
     */
    public function getContactPerson($id){
    	$result = $this->_backend->get($id);
    	return $result;
    }
    
    /**
     * 
     * Enter description here ...
     * @param unknown_type $contactId
     */
   	public function getMainContactPersonForContactIdBreakNull($contactId){
    	try{
    		return $this->_backend->getByPropertySet(
    			array(
    				'contact_id' => $contactId,
    				'is_main_contact_person' => 1
    			),
    			false, 	// dont fetch deleted
    			false	// get record set (no single record)
    		);
    	}catch(Exception $e){
    		return null;
    	}
    }
    
    /**
     * 
     * Enter description here ...
     * @param unknown_type $record
     */
  	 protected function updateContactWithMainContactPerson(Addressbook_Model_ContactPerson $record){
    	$toUpdateContact = $record->getForeignRecord('contact_id', Addressbook_Controller_Contact::getInstance());
    	$mainContact = $record->getForeignRecord('contact_person_id', Addressbook_Controller_Contact::getInstance());
    	
    	$toUpdateContact->grabPersonFrom($mainContact);
    	Addressbook_Controller_Contact::getInstance()->suppressModlog(true);
    	Addressbook_Controller_Contact::getInstance()->update($toUpdateContact);
    	Addressbook_Controller_Contact::getInstance()->suppressModlog(false);
    }
   
    /**
     * 
     * Release current main contact persons (should be only one :-)
     * Called after record is created or from update inspector (id:necessary for update -> therefore after create)
     * @param Addressbook_Model_ContactPerson $record
     */
    protected function releaseCurrentMainContactPersons( Addressbook_Model_ContactPerson $record ){
    	
    	$currentContactPersons = $this->getMainContactPersonForContactIdBreakNull($record->getForeignId('contact_id'));
    	
    	foreach($currentContactPersons as $updateContactPerson){
    		if(	
    			$updateContactPerson->__get('is_main_contact_person') &&
    			($updateContactPerson->getForeignId('contact_person_id') != $record->getForeignId('contact_person_id'))
    		){
    			$updateContactPerson->__set('is_main_contact_person', false);
    			
    			// REMARK-1 -> keep sure, that afterCreate und update inspector only act if: is_main_contact_person = true
    			$this->update($updateContactPerson);
    		}
    	}
    }
    
 	/**
 	 * (non-PHPdoc)
 	 * @see Tinebase_Controller_Record_Abstract::_afterCreate()
 	 */
	protected function _afterCreate(Tinebase_Record_Interface $_record)
    {
    	// REMARK-1: keep this
    	if($_record->__get('is_main_contact_person')){
        	$this->releaseCurrentMainContactPersons($_record);
        	$this->updateContactWithMainContactPerson($_record);
    	}
    }
    
    /**
     * (non-PHPdoc)
     * @see Tinebase_Controller_Record_Abstract::_inspectUpdate()
     */
 	protected function _inspectUpdate($_record, $_oldRecord)
    {
    	// REMARK-1: keep this
    	if($_record->__get('is_main_contact_person') && ($_record->__get('is_main_contact_person') != $_oldRecord->__get('is_main_contact_person'))) {
        	$this->releaseCurrentMainContactPersons($_record);
        	$this->updateContactWithMainContactPerson($_record);
    	}
    }
}