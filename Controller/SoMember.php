<?php
/**
 * Tine 2.0
 *
 * @package     Addressbook
 * @subpackage  Controller
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schuele <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2007-2008 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id: Salutation.php 7540 2009-04-01 11:04:15Z p.schuele@metaways.de $
 * 
 * @todo        add possiblity to change salutations (extend Tinebase_Controller_Record_Abstract)
 */
/**
 * contact controller for Addressbook
 *
 * @package     Addressbook
 * @subpackage  Controller
 */
class Addressbook_Controller_SoMember extends Tinebase_Controller_Record_Abstract
{
    /**
     * the constructor
     *
     * don't use the constructor. use the singleton 
     */
    private function __construct() {
        $this->_applicationName = 'Addressbook';
        $this->_modelName = 'Addressbook_Model_SoMember';
        $this->_backend = Addressbook_Backend_Factory::factory(Addressbook_Backend_Factory::SO_MEMBER);
        $this->_currentAccount = Tinebase_Core::getUser();
        $this->_purgeRecords = FALSE;
    }
    
    /**
     * don't clone. Use the singleton.
     *
     */
    private function __clone() 
    {        
    }
    
    /**
     * holdes the instance of the singleton
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
            self::$_instance = new Addressbook_Controller_SoMember();
        }
        
        return self::$_instance;
    }    
    
        /**
     * fetch one contact identified by $_userId
     *
     * @param   int $_userId
     * @return  Addressbook_Model_Contact
     * @throws  Addressbook_Exception_AccessDenied if user has no read grant
     */
    public function getByContactId($_contactId)
    {
        $soMember = $this->_backend->getByContactId($_contactId);
         
        return $soMember;            
    } 
    
    public function get($_contactId){
    	        $soMember = $this->_backend->getByContactId($_contactId);
         
        return $soMember;     
    }
}