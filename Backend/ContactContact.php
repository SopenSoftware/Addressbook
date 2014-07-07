<?php
class Addressbook_Backend_ContactContact extends Tinebase_Backend_Sql_Abstract
{
    /**
     * Table name without prefix
     *
     * @var string
     */
    protected $_tableName = 'addressbook_addressbook';
    
    /**
     * Model name
     *
     * @var string
     */
    protected $_modelName = 'Addressbook_Model_ContactContact';

    /**
     * if modlog is active, we add 'is_deleted = 0' to select object in _getSelect()
     *
     * @var boolean
     */
    protected $_modlogActive = TRUE;
    
    public function getContactIdsByRelationDescriptor($relationDescriptorId, $direction){
    	$recordSet = $this->getMultipleByProperty((int)$relationDescriptorId, 'relation_descriptor_id');
    	$aIds = array();
    	foreach($recordSet as $record){
    		if($direction == 'parent'){
    			$aIds[] = $record->__get('from_contact_id');
    		}else{
    			$aIds[] = $record->__get('to_contact_id');
    		}
    	}
    	return $aIds;
    }
    
    public function getContactContactsAll($id){
    	// children and siblings
    	$decessorRecordSet = $this->getMultipleByProperty($id, 'from_contact_id');
    	$this->appendForeignRecordToRecordSet($decessorRecordSet, 'relation_descriptor_id', 'relation_descriptor_id', 'id', new Addressbook_Backend_ContactRelationDescriptor());
    	//$this->appendForeignRecordToRecordSet($decessorRecordSet, 'to_contact_id', 'to_contact_id', 'id', new Addressbook_Backend_Sql());
    	
    	return $decessorRecordSet;
    }
    
    public function getContactContactsByRelationDescriptor($contactId, $degree){
    	// children and siblings
    	switch($degree){
    		case Addressbook_Model_ContactRelationDescriptor::DEGREE_PARENT:
    				$decessorRecordSet = $this->getMultipleByProperty($id, 'from_contact_id');
    			break;
    		case Addressbook_Model_ContactRelationDescriptor::DEGREE_CHILD:
    			
    			break;
    		case Addressbook_Model_ContactRelationDescriptor::DEGREE_SIBLING:
    			
    			break;
    	}
    	
    	$this->appendForeignRecordToRecordSet($decessorRecordSet, 'relation_descriptor_id', 'relation_descriptor_id', 'id', new Addressbook_Backend_ContactRelationDescriptor());
    	//$this->appendForeignRecordToRecordSet($decessorRecordSet, 'to_contact_id', 'to_contact_id', 'id', new Addressbook_Backend_Sql());
    	
    	return $decessorRecordSet;
    }
}