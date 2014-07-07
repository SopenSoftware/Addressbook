<?php
/**
 * Tine 2.0
 *
 * @package     Addressbook
 * @subpackage  Frontend
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Lars Kneschke <l.kneschke@metaways.de>
 * @copyright   Copyright (c) 2007-2008 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id: Json.php 12615 2010-02-02 17:55:20Z p.schuele@metaways.de $
 *
 * @todo        use functions from Tinebase_Frontend_Json_Abstract
 *              -> get/save/getAll
 * @todo        remove deprecated functions afterwards
 */

/**
 * backend class for Zend_Json_Server
 *
 * This class handles all Json requests for the addressbook application
 *
 * @package     Addressbook
 * @subpackage  Frontend
 * @todo        handle timezone management
 */
class Addressbook_Frontend_Json extends Tinebase_Frontend_Json_Abstract
{
    protected $_applicationName = 'Addressbook';
    
    /****************************************** get contacts *************************************/

    /**
     * get one contact identified by contactId
     *
     * @param int $id
     * @return array
     */
    public function getContact($id)
    {
        $result = array();
               
        $contact = Addressbook_Controller_Contact::getInstance()->get($id);
        $result = $this->_contactToJson($contact);
         return $result;
        //return $this->_get($contactId, Addressbook_Controller_Contact::getInstance());
    }
    
    public function previewAddressLabel($contactId, $addressNumber){
    	return Addressbook_Controller_Contact::getInstance()->createAddressLabel($contactId, $addressNumber);
    }
    
	public function checkDuplicate( $recordData){
		try{
			if(!is_array($recordData)){
				$recordData = Zend_Json::decode($recordData);
			}
			$contactIds = array();
			$count = 0;
			//$count = ->getBrevetationCountByNumber($brevetationNr);
			if(Addressbook_Custom_Contact::getDuplicateSearchFilter($recordData, $filter)){
				$count = Addressbook_Controller_Contact::getInstance()->searchCount($filter);
				if($count>0){
					// -> get only ids!! (param4: true)
					$contactIds = Addressbook_Controller_Contact::getInstance()->search($filter,$paging,false,true);
				}
			}
			
			return array(
	    		'success' => true,
	    		'check' => ($count>0),
	    		'count' => $count,
				'duplicateIds' => $contactIds
			);
						
		}catch(Exception $e){
			return array(
	    		'success' => false,
	    		'check' => false,
	    		'count' => 0,
				'duplicateIds' => array(),
				'errorInfo' => $e->getMessage()
			);
		}
			 
	}
    
    public function debitorCheckUnique($debitorExtId, $contactId){
    	
    	$successData = array(
			'data'       => array(
    			'contact_id' => null,
    			'n_fileas' => null,
    			'debitor_ext_id' => $debitorExtId
    		),
			'success' 	 => true
		);
		if(class_exists('Addressbook_Custom_Contact')){
			return Addressbook_Custom_Contact::checkDebitorUnique($debitorExtId, $contactId);
		}
		return $successData;
    }
    
    public function getContactContactsAll($id){
    	 $result = array();
       	 return Addressbook_Controller_Contact::getInstance()->getContactContactsAll($id)->toArray();
    }
    
    public function getContactContactTreeNodes($treeNodeId, $params){
   		$type = $params['nodeType'];
    	switch($type){
    		// group folder for relation degrees (parent, child, sibling)
    		// decessors are: Relations (ContactContact: table addressbook_addressbook)
    		case 'degree_group':
    			$contactId = $params['contactId'];
    			$direction = $params['direction'];
    			$treeNodes = Addressbook_Controller_ContactRelationDescriptor::getInstance()->getUnifiedRelationDescriptors($contactId, $direction )->toArray();
    			return array(
		            'results'       => $treeNodes,
    				'nodeType' 		=> 'relation_descriptor',
    				'treeNodeId'	=> $treeNodeId,
		            'totalcount'    => count($treeNodes)
		        );
    			break;
    		case 'relation_descriptor':
    			$relationDescriptorId = $params['relationDescriptorId'];
    			$direction = $params['direction'];

    			$treeNodes = Addressbook_Controller_Contact::getInstance()->getContactsByRelationDescriptor($relationDescriptorId, $direction)->toArray();
    			return array(
		            'results'       => $treeNodes,
    				'nodeType' 		=> 'contact',
    				'treeNodeId'	=> $treeNodeId,
		            'totalcount'    => count($treeNodes)
		        );
    			break;    			
    	}
    }
    
    public function searchContactContacts($filter,$paging){
    	return $this->_search($filter, $paging, Addressbook_Controller_ContactContact::getInstance(), 'Addressbook_Model_ContactContactFilter');
    }
    
    public function searchContactRelationDescriptors($filter, $paging){
    	//return Addressbook_Controller_Contact::getInstance()->getAllRelationDescriptors()->toArray();
    	return $this->_search($filter, $paging, Addressbook_Controller_ContactRelationDescriptor::getInstance(), 'Addressbook_Model_ContactRelationDescriptorFilter');
    }
    
    public function saveContactContact($recordData){
    	$contactContact = new Addressbook_Model_ContactContact();
    	$contactContact->setFromJsonInUsersTimezone($recordData);
    	return Addressbook_Controller_Contact::getInstance()->createContactContact($contactContact);
    }
    
    /**
     * get associated Sopen Member
     *
     * @param int $contactId
     * @return array
     */
    public function getSoMember($contactId)
    {
        $result = array();
               
        $soMember = Addressbook_Controller_SoMember::getInstance()->getByContactId($contactId);
        $result = $this->_soMemberToJson($soMember);
        return $result;
        //return $this->_get($contactId, Addressbook_Controller_Contact::getInstance());
    }
    
    /**
     * Search for contacts matching given arguments
     *
     * @param  array $filter
     * @param  array $paging
     * @return array
     */
    public function searchContacts($filter, $paging)
    {
        return $this->_search($filter, $paging, Addressbook_Controller_Contact::getInstance(), 'Addressbook_Model_ContactFilter');
    }    

    /****************************************** save / delete / import contacts ****************************/
    
    /**
     * delete multiple contacts
     *
     * @param array $ids list of contactId's to delete
     * @return array
     */
    public function deleteContacts($ids)
    {
        return $this->_delete($ids, Addressbook_Controller_Contact::getInstance());
    }
    
    /**
     * save one contact
     *
     * if $recordData['id'] is empty the contact gets added, otherwise it gets updated
     *
     * @param  array $recordData an array of contact properties
     * @return array
     */
    public function saveContact($recordData/*,$soMemberData*/)
    {
    	$db = Tinebase_Core::getDb();
    	$transactionId = Tinebase_TransactionManager::getInstance()->startTransaction($db);
        $contact = new Addressbook_Model_Contact();
        $contact->setFromJsonInUsersTimezone($recordData);
       /* $soMember = new Addressbook_Model_SoMember();
        // allow empty member data
        try{
        	$soMember->setFromJsonInUsersTimezone($soMemberData);
        	$soMemberValid = true;
        }catch(Exception $e){
        	// invalid member means member get's not created or updated
        	$soMemberValid = false;
        }
        */
        // get open3A component interface
        
        $open3A = CSopen::instance()->getModule('Open3A');
        
        if (empty($contact->id)) {
            $contact = Addressbook_Controller_Contact::getInstance()->create($contact);
            if($open3A->isInstalled()){
            	//$open3A->createAdress($contact);
            }
        } else {
            $contact = Addressbook_Controller_Contact::getInstance()->update($contact);
            if($open3A->isInstalled()){
            	//$open3A->updateAdress($contact);
            }
        }
        Tinebase_TransactionManager::getInstance()->commitTransaction($transactionId);

        return  $this->getContact($contact->getId());
    }
    
    
// ContactPerson
	public function getContactPerson($id){
		if(!$id ) {
			$obj = Addressbook_Controller_ContactPerson::getInstance()->getEmptyContactPerson();
		} else {
			$obj = Addressbook_Controller_ContactPerson::getInstance()->get($id);
		}
		$objData = $obj->toArray();

		return $objData;
	}

	public function searchContactPersons($filter,$paging){
		return $this->_search($filter,$paging,Addressbook_Controller_ContactPerson::getInstance(),'Addressbook_Model_ContactPersonFilter');
	}

	public function deleteContactPersons($ids){
		return $this->_delete($ids, Addressbook_Controller_ContactPerson::getInstance());
	}

	public function saveContactPerson($recordData){
		$obj = new Addressbook_Model_ContactPerson();
        $obj->setFromArray($recordData);
        try{
        	$objId = $obj->getId('id');

        	$obj = Addressbook_Controller_ContactPerson::getInstance()->get($objId);
        	$obj->setFromArray($recordData);
        	$obj = Addressbook_Controller_ContactPerson::getInstance()->update($obj);
        }catch(Exception $e){

        	$obj = Addressbook_Controller_ContactPerson::getInstance()->create($obj);
        }
        return $obj->toArray();
	}
	
	
// ContactMultipleCriteria
	public function getContactMultipleCriteria($id){
		if(!$id ) {
			$obj = Addressbook_Controller_ContactMultipleCriteria::getInstance()->getEmptyContactMultipleCriteria();
		} else {
			$obj = Addressbook_Controller_ContactMultipleCriteria::getInstance()->get($id);
		}
		$objData = $obj->toArray();

		return $objData;
	}

	public function searchContactMultipleCriterias($filter,$paging){
		return $this->_search($filter,$paging,Addressbook_Controller_ContactMultipleCriteria::getInstance(),'Addressbook_Model_ContactMultipleCriteriaFilter');
	}

	public function deleteContactMultipleCriterias($ids){
		return $this->_delete($ids, Addressbook_Controller_ContactMultipleCriteria::getInstance());
	}
	
	public function saveContactMultipleCriteria($recordData){
		return $this->_save($recordData, Addressbook_Controller_ContactMultipleCriteria::getInstance(), 'ContactMultipleCriteria');
	}
    
        /**
     * import contacts
     * 
     * @param array $files to import
     * @param array $importOptions
     * @param string $definitionId
     * @return array
     */
    public function importContacts($files, $importOptions, $definitionId)
    {
        return $this->_import($files, $definitionId, Addressbook_Controller_Contact::getInstance(), $importOptions);
    }
    
    /**
     * import postal codes
     * 
     * @param array $files to import
     * @param array $importOptions
     * @param string $definitionId
     * @return array
     */
    public function importPostalCodes($files, $importOptions, $definitionId)
    {
        return $this->_import($files, $definitionId, Addressbook_Controller_PostalCode::getInstance(), $importOptions);
    }
    
    /****************************************** get default adb ****************************/
    
    /**
     * get default addressbook
     * 
     * @return array
     */
    public function getDefaultAddressbook()
    {
        $defaultAddressbook = Addressbook_Controller_Contact::getInstance()->getDefaultAddressbook();
        $defaultAddressbookArray = $defaultAddressbook->toArray();
        $defaultAddressbookArray['account_grants'] = Tinebase_Container::getInstance()->getGrantsOfAccount(Tinebase_Core::getUser(), $defaultAddressbook->getId())->toArray();
        
        return $defaultAddressbookArray;
    }
    
    public function getLocationsByPostalCode($postalCode, $countryCode){
    	try{
	    	$data = Addressbook_Controller_PostalCode::getInstance()->getByPostalCode($postalCode, $countryCode);
	    	return array(
	    		'state' => 'success',
	    		'data' => $data,
	    		'count' => count($data)
	    	);
    	}catch(Exception $e){
    		return array(
	    		'state' => 'failure',
	    		'data' => array(),
	    		'count' => 0
	    	);
    	}
    }
    
    public function getPostalCodesByLocation($location, $countryCode){
    	return Addressbook_Controller_PostalCode::getInstance()->getByLocation($postalCode, $countryCode);
    }
    
    
    /****************************************** get salutations ****************************/
    
    /**
     * get salutations
     *
     * @return array
     * @todo   use _getAll() from Tinebase_Frontend_Json_Abstract
     */
   public function getSalutations()
    {
         $result = array(
            'results'     => array(),
            'totalcount'  => 0
        );
        
        if($rows = Addressbook_Controller_Salutation::getInstance()->getSalutations('name')) {
            $rows->translate();
            $result['results']      = $rows->toArray();
            $result['totalcount']   = count($result['results']);
        }

        return $result;
    }  
    
    public function getSoFeeCategories(){
    
    	$result = array(
            'results'     => array(),
            'totalcount'  => 0
        );
        
        if($rows = Addressbook_Controller_SoFeeCategory::getInstance()->getSoFeeCategories()) {
            $rows->translate();
            $result['results']      = $rows->toArray();
            $result['totalcount']   = count($result['results']);
        }
        return $result;
    }
    public function getSoFeePaymentIntervals(){
    
    	$result = array(
            'results'     => array(),
            'totalcount'  => 0
        );
        
        if($rows = Addressbook_Controller_SoFeePaymentInterval::getInstance()->getSoFeePaymentIntervals()) {
            $rows->translate();
            $result['results']      = $rows->toArray();
            $result['totalcount']   = count($result['results']);
        }
        return $result;
    }
    /**
     * Get payment methods
     * HH: DON'T FORGET TO ADD THIS TO REGISTRY DATA!!!
     */
    public function getSoFeePaymentMethods(){
    
    	$result = array(
            'results'     => array(),
            'totalcount'  => 0
        );
        
        if($rows = Addressbook_Controller_SoFeePaymentMethod::getInstance()->getSoFeePaymentMethods()) {
            $rows->translate();
            $result['results']      = $rows->toArray();
            $result['totalcount']   = count($result['results']);
        }
        return $result;
    }
    /**
     * Get entry reasons
     * HH: DON'T FORGET TO ADD THIS TO REGISTRY DATA!!!
     */
    public function getSoEntryReasons(){
    
    	$result = array(
            'results'     => array(),
            'totalcount'  => 0
        );
        
        if($rows = Addressbook_Controller_SoEntryReason::getInstance()->getSoEntryReasons()) {
            $rows->translate();
            $result['results']      = $rows->toArray();
            $result['totalcount']   = count($result['results']);
        }
        return $result;
    }
    /**
     * Get termination reasons
     * HH: DON'T FORGET TO ADD THIS TO REGISTRY DATA!!!
     */
    public function getSoTerminationReasons(){
    
    	$result = array(
            'results'     => array(),
            'totalcount'  => 0
        );
        
        if($rows = Addressbook_Controller_SoTerminationReason::getInstance()->getSoTerminationReasons()) {
            $rows->translate();
            $result['results']      = $rows->toArray();
            $result['totalcount']   = count($result['results']);
        }
        return $result;
    }
    /**
     * Get member affiliates
     * HH: DON'T FORGET TO ADD THIS TO REGISTRY DATA!!!
     */
    public function getSoMemberAffiliates(){
    
    	$result = array(
            'results'     => array(),
            'totalcount'  => 0
        );
        
        if($rows = Addressbook_Controller_SoMemberAffiliate::getInstance()->getSoMemberAffiliates()) {
            $rows->translate();
            $result['results']      = $rows->toArray();
            $result['totalcount']   = count($result['results']);
        }        
        return $result;
    }
    /**
     * Get member affiliates
     * HH: DON'T FORGET TO ADD THIS TO REGISTRY DATA!!!
     */
    public function getSoCommitteeFuncs(){
    
    	$result = array(
            'results'     => array(),
            'totalcount'  => 0
        );
        
        if($rows = Addressbook_Controller_SoCommitteeFunc::getInstance()->getSoCommitteeFuncs()) {
            $rows->translate();
            $result['results']      = $rows->toArray();
            $result['totalcount']   = count($result['results']);
        }      
        return $result;
    } 
           /**
     * Get member affiliates
     * HH: DON'T FORGET TO ADD THIS TO REGISTRY DATA!!!
     */
    public function getSoContactTitles(){
    
    	$result = array(
            'results'     => array(),
            'totalcount'  => 0
        );
        
        if($rows = Addressbook_Controller_SoContactTitle::getInstance()->getSoContactTitles()) {
            $rows->translate();
            $result['results']      = $rows->toArray();
            $result['totalcount']   = count($result['results']);
        }      
        return $result;
    }   

   
    /****************************************** helper functions ***********************************/
    
    /**
     * returns multiple records prepared for json transport
     *
     * @param Tinebase_Record_RecordSet $_records Tinebase_Record_Abstract
     * @param Tinebase_Model_Filter_FilterGroup
     * @return array data
     */
    protected function _multipleRecordsToJson(Tinebase_Record_RecordSet $_records, $_filter=NULL)
    {
        $result = parent::_multipleRecordsToJson($_records, $_filter);
        
        foreach ($result as &$contact) {
            $contact['jpegphoto'] = $this->_getImageLink($contact);
        }
        
        return $result;
    }
    

    /**
     * returns contact prepared for json transport
     *
     * @param Addressbook_Model_Contact $_contact
     * @return array contact data
     * 
     * @deprecated
     */
    protected function _contactToJson($_contact)
    {   
        $_contact->setTimezone(Tinebase_Core::get('userTimeZone'));
        $result = $_contact->toArray();
        
        $result['container_id'] = Tinebase_Container::getInstance()->getContainerById($_contact->container_id)->toArray();
        $result['container_id']['account_grants'] = Tinebase_Container::getInstance()->getGrantsOfAccount(Tinebase_Core::get('currentAccount'), $_contact->container_id)->toArray();
        
        $result['jpegphoto'] = $this->_getImageLink($_contact);
        
        return $result;
    }

    /**
     * returns contact prepared for json transport
     *
     * @param Addressbook_Model_Contact $_contact
     * @return array contact data
     * 
     * @deprecated
     */
    protected function _soMemberToJson($_soMember)
    {   
        $_soMember->setTimezone(Tinebase_Core::get('userTimeZone'));
        $result = $_soMember->toArray();
        
        return $result;
    }

    /**
     * returns a image link
     * 
     * @param  Addressbook_Model_Contact|array
     * @return string
     */
    protected function _getImageLink($contact)
    {
        if (!empty($contact->jpegphoto)) {
            $link =  'index.php?method=Tinebase.getImage&application=Addressbook&location=&id=' . $contact['id'] . '&width=90&height=90&ratiomode=0';
        } else {
            $link = CSopen::instance()->getTineImagesURL().'/empty_photo.png';
        }
        return $link;
    }

    public function getAddressbooks(){
    	$addressbooks = Tinebase_Container::getInstance()->getSharedContainer(Tinebase_Core::getUser(), 'Addressbook', Tinebase_Model_Grants::GRANT_ADD);
     	foreach ($addressbooks as $addressbook) {
	    	$result[] = array($addressbook->getId(), $addressbook->name);
	    }
	    return $result;
    }
    
    /**
     * Returns registry data of addressbook.
     * @see Tinebase_Application_Json_Abstract
     * 
     * @return mixed array 'variable name' => 'data'
     */
    public function getRegistryData()
    {
        $filter = new Tinebase_Model_ImportExportDefinitionFilter(array(
            array('field' => 'plugin', 'operator' => 'equals', 'value' => 'Addressbook_Import_Csv'),
        ));
        $importDefinitions = Tinebase_ImportExportDefinition::getInstance()->search($filter);
        try {
            $defaultDefinitionArray = Tinebase_ImportExportDefinition::getInstance()->getByName('adb_tine_import_csv')->toArray();
        } catch (Tinebase_Exception_NotFound $tenf) {
            if (count($importDefinitions) > 0) {
                $defaultDefinitionArray = $importDefinitions->getFirstRecord()->toArray();
            } else {
                Tinebase_Core::getLogger()->warn(__METHOD__ . '::' . __LINE__ . ' No import definitions found for Addressbook');
                $defaultDefinitionArray = array();
            }
        }
        
        
        $registryData = array(
            'Salutations' => $this->getSalutations(),
        	'SoContactTitles'	=> $this->getSoContactTitles(),
        	'Addressbooks' => $this->getAddressbooks(),
        	'defaultAddressbook'        => $this->getDefaultAddressbook(),
        	'defaultImportDefinition'   => $defaultDefinitionArray,
	        'importDefinitions'         => array(
        	        'results'               => $importDefinitions->toArray(),
                	'totalcount'            => count($importDefinitions)
            	 ) 	
        );        
        return $registryData;    
    }
}
