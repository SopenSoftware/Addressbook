<?php
/**
 * Tine 2.0
 *
 * @package     Addressbook
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Lars Kneschke <l.kneschke@metaways.de>
 * @copyright   Copyright (c) 2007-2009 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id: Sql.php 14720 2010-05-31 13:05:53Z g.ciyiltepe@metaways.de $
 * 
 * @todo        move visibility='displayed' check from getSelect to contact filter
 */

/**
 * sql backend class for the addressbook
 *
 * @package     Addressbook
 */
class Addressbook_Backend_Sql extends Tinebase_Backend_Sql_Abstract
{
    /**
     * Table name without prefix
     *
     * @var string
     */
    protected $_tableName = 'addressbook';
    
    /**
     * Model name
     *
     * @var string
     */
    protected $_modelName = 'Addressbook_Model_Contact';

    /**
     * if modlog is active, we add 'is_deleted = 0' to select object in _getSelect()
     *
     * @var boolean
     */
    protected $_modlogActive = TRUE;

 
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
       	Tinebase_User::getInstance()->resolveUsers($record, 'created_by');
    	Tinebase_User::getInstance()->resolveUsers($record, 'last_modified_by');
    	
    }
    
    /**
     * Get Donator record by id (with embedded dependent contacts)
     * 
     * @param int $id
     */
    public function get($id, $_getDeleted = FALSE){
    	$record = parent::get($id, $_getDeleted);
    	$this->appendDependentRecords($record);
    	return $record;
    }
    
    
    /**
     * fetch one contact of a user identified by his user_id
     *
     * @param   int $_userId
     * @return  Addressbook_Model_Contact 
     * @throws  Addressbook_Exception_NotFound if contact not found
     */
    public function getByUserId($_userId)
    {
        // can't use this anymore because this has to work even if user is hidden from addressbook
        //$contact = $this->getByProperty($_userId, 'account_id');
        
        $select = parent::_getSelect('*');
        $select->where($this->_db->quoteIdentifier($this->_tableName . '.account_id') . ' = ?', $_userId)
               ->limit(1);

        $stmt = $this->_db->query($select);
        $queryResult = $stmt->fetch();
        $stmt->closeCursor();
                
        if (!$queryResult) {
            throw new Addressbook_Exception_NotFound('Contact with user id ' . $_userId . ' not found.');
        }
        
        $contact = $this->_rawDataToRecord($queryResult);
               
        // get custom fields
        if ($contact->has('customfields')) {
            Tinebase_CustomField::getInstance()->resolveRecordCustomFields($contact);
        }
               
        return $contact;
    }
    
    /**
     * Creates new entry
     *
     * @param   Tinebase_Record_Interface $_record
     * @return  Tinebase_Record_Interface
     * @throws  Tinebase_Exception_InvalidArgument
     * @throws  Tinebase_Exception_UnexpectedValue
     * 
     * @todo    remove autoincremental ids later
     */
    public function create(Tinebase_Record_Interface $_record) 
    {
        $contact = parent::create($_record);
        if (! empty($_record->jpegphoto)) {
            $contact->jpegphoto = $this->_saveImage($contact->getId(), $_record->jpegphoto);
        }
        
        return $contact;
    }
    
    /**
     * Updates existing entry
     *
     * @param Tinebase_Record_Interface $_record
     * @throws Tinebase_Exception_Record_Validation|Tinebase_Exception_InvalidArgument
     * @return Tinebase_Record_Interface Record|NULL
     */
    public function update(Tinebase_Record_Interface $_record) 
    {
        $contact = parent::update($_record);
        if (isset($_record->jpegphoto)) {
            $contact->jpegphoto = $this->_saveImage($contact->getId(), $_record->jpegphoto);
        }
        
        return $contact;
    }
    
    /**
     * returns contact image
     *
     * @param int $_contactId
     * @return blob
     */
    public function getImage($_contactId)
    {
        $select = $this->_db->select()
            ->from($this->_tablePrefix . 'addressbook_image', array('image'))
            ->where($this->_db->quoteInto($this->_db->quoteIdentifier('contact_id'). ' = ?', $_contactId, Zend_Db::INT_TYPE));
        $imageData = $this->_db->fetchOne($select, 'image');
        
        return $imageData ? base64_decode($imageData) : '';
    }
    
    /**
     * saves image to db
     *
     * @param  int $_contactId
     * @param  blob $imageData
     * @return blob
     */
    public function _saveImage($_contactId, $imageData)
    {
    	$this->_db->delete($this->_tablePrefix . 'addressbook_image', $this->_db->quoteInto($this->_db->quoteIdentifier('contact_id') . ' = ?', $_contactId, Zend_Db::INT_TYPE));
        if (! empty($imageData)) {
            $this->_db->insert($this->_tablePrefix . 'addressbook_image', array(
                'contact_id'    => $_contactId,
                'image'         => base64_encode($imageData)
            ));
        }
        
        return $imageData;
    }
    
    /**
     * get the basic select object to fetch records from the database
     *  
     * @param array|string|Zend_Db_Expr $_cols columns to get, * per default
     * @param boolean $_getDeleted get deleted records (if modlog is active)
     * @return Zend_Db_Select
     * 
     * @todo    move visibility='displayed' check to contact filter
     */
    protected function _getSelect($_cols = '*', $_getDeleted = FALSE)
    {        
        $select = parent::_getSelect($_cols, $_getDeleted);
        
        $select->joinLeft(
            /* table  */ array('account' => $this->_tablePrefix . 'accounts'), 
            /* on     */ $this->_db->quoteIdentifier('account.id') . ' = ' . $this->_db->quoteIdentifier($this->_tableName . '.account_id'),
            /* select */ array()
        );
        
        if (Tinebase_Core::getUser() instanceof Tinebase_Model_FullUser) {
            $where = "ISNULL(account_id) OR (NOT ISNULL(account_id) AND (visibility='displayed' OR account_id = '".Tinebase_Core::getUser()->getId()."'))";
        } else {
            $where = "ISNULL(account_id) OR (NOT ISNULL(account_id) AND visibility='displayed')";
        }
        
        $select->where($where);        
        
        if ($_cols == '*' || array_key_exists('jpegphoto', (array)$_cols)) {
            $select->joinLeft(
                /* table  */ array('image' => $this->_tablePrefix . 'addressbook_image'), 
                /* on     */ $this->_db->quoteIdentifier('image.contact_id') . ' = ' . $this->_db->quoteIdentifier($this->_tableName . '.id'),
                /* select */ array('jpegphoto' => 'IF(ISNULL('. $this->_db->quoteIdentifier('image.image') .'), 0, 1)')
            );
        }
        
        // return contact type
        if ($_cols == '*' || array_key_exists('type', (array)$_cols)) {
            $select->columns(array('type' => "IF(ISNULL(account_id),'contact', 'user')"));
        }
        
        return $select;
    }
    
    /**
     * converts record into raw data for adapter
     *
     * @param  Tinebase_Record_Abstract $_record
     * @return array
     */
    protected function _recordToRawData($_record)
    {
        $result = parent::_recordToRawData($_record);

        // some columns got joined from another table and can't be written
        unset($result['type']);

        return $result;
    }
    
}
