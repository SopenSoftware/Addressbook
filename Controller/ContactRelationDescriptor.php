<?php
class Addressbook_Controller_ContactRelationDescriptor extends Tinebase_Controller_Record_Abstract
{
    /**
     * the constructor
     *
     * don't use the constructor. use the singleton 
     */
    private function __construct() {
        $this->_applicationName = 'Addressbook';
        $this->_modelName = 'Addressbook_Model_ContactRelationDescriptor';
        $this->_backend = new Addressbook_Backend_ContactRelationDescriptor();
    }
    /**
     * don't clone. Use the singleton.
     *
     */
    private function __clone() 
    {        
    }
    
    /**
     * holds the instance of the singleton
     *
     * @var Addressbook_Controller_Contact
     */
    private static $_instance = NULL;
    
    /**
     * the singleton pattern
     *
     * @return Addressbook_Controller_Contact
     */
    public static function getInstance() 
    {
        if (self::$_instance === NULL) {
            self::$_instance = new self();
        }
        
        return self::$_instance;
    }   
    //Addressbook_Backend_ContactRelationDescriptor::getUnifiedRelationDescriptors 
    public function getUnifiedRelationDescriptors($contactId, $degree){
    	return $this->_backend->getUnifiedRelationDescriptors($contactId,$degree);
    }
    public function search(Tinebase_Model_Filter_FilterGroup $_filter = NULL, Tinebase_Record_Interface $_pagination = NULL, $_getRelations = FALSE, $_onlyIds = FALSE, $_action = 'get')
    {
    	$this->_checkRight($_action);
        //$this->checkFilterACL($_filter, $_action);
        
        $result = $this->_backend->search($_filter, $_pagination, $_onlyIds);

        return $result;    
    }
    
    public function searchCount(Tinebase_Model_Filter_FilterGroup $_filter, $_action = 'get') 
    {
    //    $this->checkFilterACL($_filter, $_action);

        $count = $this->_backend->searchCount($_filter);
        
        return $count;
    }
    
 
}