<?php
class Addressbook_Controller_SoMemberAffiliate extends Tinebase_Controller_Abstract
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
            self::$_instance = new Addressbook_Controller_SoMemberAffiliate();
        }
        
        return self::$_instance;
    }
            
    /**
     * the constructor
     *
     * don't use the constructor. use the singleton 
     */
    private function __construct() {
        $this->_backend = Addressbook_Backend_Factory::factory(Addressbook_Backend_Factory::SO_MEMBER_AFFILIATE);
        $this->_currentAccount = Tinebase_Core::getUser();
    }
    
    /**
     * don't clone. Use the singleton.
     *
     */
    private function __clone() 
    {        
    }
        

    public function getSoMemberAffiliates($_sort = 'id', $_dir = 'ASC')
    {
        $result = $this->_backend->getAll($_sort, $_dir);

        return $result;    
    }
}