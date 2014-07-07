<?php
/**
 * Tine 2.0
 * 
 * @package     Addressbook
 * @license     http://www.gnu.org/licenses/agpl.html AGPL3
 * @author      Philipp Schuele <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2008 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id:Asterisk.php 4159 2008-09-02 14:15:05Z p.schuele@metaways.de $
 *
 */

/**
 * salutation backend for the Addressbook application
 * 
 * @package     Addressbook
 * 
 */
class Addressbook_Backend_SoMember extends Tinebase_Backend_Sql_Abstract
{
    /**
     * Table name without prefix
     *
     * @var string
     */
    protected $_tableName = 'so_membership';
    
    /**
     * Model name
     *
     * @var string
     */
    protected $_modelName = 'Addressbook_Model_SoMember';
    
    /**
     * fetch one contact of a user identified by his user_id
     *
     * @param   int $_userId
     * @return  Addressbook_Model_Contact 
     * @throws  Addressbook_Exception_NotFound if contact not found
     */
    public function getByContactId($_contactId)
    {
        $select = $this->_db->select()->from(SQL_TABLE_PREFIX . $this->_tableName)
            ->where($this->_db->quoteInto($this->_db->quoteIdentifier('contact_id') . ' = ?', $_contactId));
        $row = $this->_db->fetchRow($select);
        $result = new Addressbook_Model_SoMember($row);
        
        return $result;
    }
}