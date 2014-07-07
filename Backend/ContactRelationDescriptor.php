<?php
class Addressbook_Backend_ContactRelationDescriptor extends Tinebase_Backend_Sql_Abstract
{
    /**
     * Table name without prefix
     *
     * @var string
     */
    protected $_tableName = 'addressbook_relation_descriptor';
    
    /**
     * Model name
     *
     * @var string
     */
    protected $_modelName = 'Addressbook_Model_ContactRelationDescriptor';

    /**
     * if modlog is active, we add 'is_deleted = 0' to select object in _getSelect()
     *
     * @var boolean
     */
    protected $_modlogActive = false;
    
    /**
     * 
     * Get unified relation descriptors
     * @param integer $contactId
     * @param string $degree
     */
    public function getUnifiedRelationDescriptors($contactId, $degree){
        $select = $this->_db->select()
    	->from(SQL_TABLE_PREFIX . 'addressbook_addressbook', array('relation_descriptor_id'))
    	->distinct(true);
    	switch($degree){
    		case Addressbook_Model_ContactRelationDescriptor::DEGREE_PARENT:
					$select->where('to_contact_id = '.$contactId);
    			break;
    		case Addressbook_Model_ContactRelationDescriptor::DEGREE_CHILD:
			case Addressbook_Model_ContactRelationDescriptor::DEGREE_SIBLING:
    			$select->where('from_contact_id = '.$contactId);
    			break;
    	}
    	$stmt = $this->_db->query($select);
        $relationDescriptorIds = $stmt->fetchAll();
        return $this->getMultiple($relationDescriptorIds);//->filter('degree',$degree);
    }
}