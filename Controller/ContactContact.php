<?php
class Addressbook_Controller_ContactContact extends Tinebase_Controller_Record_Abstract
{
    /**
     * the constructor
     *
     * don't use the constructor. use the singleton 
     */
    private function __construct() {
        $this->_applicationName = 'Addressbook';
        $this->_modelName = 'Addressbook_Model_ContactContact';
        $this->_backend = new Addressbook_Backend_ContactContact();
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
    
    public function getContactContactsAll($id){
    	return $this->_backend->getContactContactsAll($id);
    }
    
    public function getUnifiedRelationDescriptors($contactId, $degree){
    	return $this->_backend->getUnifiedRelationDescriptors($id);
    }
}