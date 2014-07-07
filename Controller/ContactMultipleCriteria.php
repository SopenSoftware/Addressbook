<?php
/**
 * 
 * Enter description here ...
 * @author hhartl
 *
 */
class Addressbook_Controller_ContactMultipleCriteria extends Tinebase_Controller_Record_Abstract
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
            self::$_instance = new Addressbook_Controller_ContactMultipleCriteria();
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
		$this->_backend = new Addressbook_Backend_ContactMultipleCriteria();
		$this->_modelName = 'Addressbook_Model_ContactMultipleCriteria';
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
 	 * @see Tinebase_Controller_Record_Abstract::_afterCreate()
 	 */
	protected function _afterCreate(Tinebase_Record_Interface $_record)
    {
    	
    }
    
    /**
     * (non-PHPdoc)
     * @see Tinebase_Controller_Record_Abstract::_inspectUpdate()
     */
 	protected function _inspectUpdate($_record, $_oldRecord)
    {
    	
    }
    
   	public function searchContactIds(Tinebase_Model_Filter_FilterGroup $_filter = NULL, Tinebase_Record_Interface $_pagination = NULL){
   		return $this->_backend->search($_filter, $_pagination, false, false, 'contact_id');
   	}
   	
   	public function getAllCategoryDefinitions(){
   		return SCrm_Controller_CriteriaCategory::getInstance()->getCriteriaCategoryDefinition();
   	}
}