<?php
class Addressbook_Controller_PostalCode extends Tinebase_Controller_Abstract
{
    /**
     * the salutation backend
     *
     * @var Addressbook_Backend_Salutation
     */
    protected $_backend;
    
    /**
     * holdes the instance of the singleton
     *
     * @var Addressbook_Controller_SoFeeCategory
     */
    private static $_instance = NULL;
        

    public static function getInstance() 
    {
        if (self::$_instance === NULL) {
            self::$_instance = new Addressbook_Controller_PostalCode();
        }
        
        return self::$_instance;
    }
            
    /**
     * the constructor
     *
     * don't use the constructor. use the singleton 
     */
    private function __construct() {
        $this->_backend = new Addressbook_Backend_PostalCode();
        $this->_currentAccount = Tinebase_Core::getUser();
    }
    
    /**
     * don't clone. Use the singleton.
     *
     */
    private function __clone() 
    {        
    }
        

    public function getByLocation($locationName, $countryCode)
    {
        return $this->_backend->getByLocation($locationName, $countryCode);    
    }
    
 	public function getByPostalCode($postalCode, $countryCode)
    {
		return $this->_backend->getByPostalCode($postalCode, $countryCode);
    }
}