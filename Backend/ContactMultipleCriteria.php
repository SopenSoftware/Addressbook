<?php

class Addressbook_Backend_ContactMultipleCriteria extends Tinebase_Backend_Sql_Abstract {

    /**
     * Table name without prefix
     *
     * @var string
     */
    protected $_tableName = 'contact_multiple_criteria';

    /**
     * Model name
     *
     * @var string
     */
    protected $_modelName = 'Addressbook_Model_ContactMultipleCriteria';

    /**
     *
     * @param Tinebase_Model_Filter_FilterGroup $_filter
     * @param Tinebase_Model_Pagination $_pagination
     * @param type $_onlyIds
     * @return \Tinebase_Record_RecordSet 
     */
    public function search(Tinebase_Model_Filter_FilterGroup $_filter = NULL, Tinebase_Model_Pagination $_pagination = NULL, $_onlyIds = FALSE, $withDep = false, $_property = null) {
        $recordSet = parent::search($_filter, $_pagination, $_onlyIds, $withDep, $_property);
        if (($recordSet instanceof Tinebase_Record_RecordSet) && ($recordSet->count() > 0)) {
            $it = $recordSet->getIterator();
            
            foreach ($it as $key => $record) {
                $this->appendDependentRecords($record);
            }
        }
        return $recordSet;
    }

    /**
     * Append dependent records
     *
     * @param Addressbook_Model_MultipleCriteria $record Person Record
     */
    public function appendDependentRecords(Addressbook_Model_ContactMultipleCriteria $record) {
        if ($record->__get('scrm_multiple_criteria_id')) {
            try {
                $this->appendForeignRecordToRecord($record, 'scrm_multiple_criteria_id', 'scrm_multiple_criteria_id', 'id', new SCrm_Backend_MultipleCriteria());
            } catch (Exception $e) {
                // Silent Failure
            }
        }
        
    	if ($record->__get('scrm_criteria_category_id')) {
            try {
                $this->appendForeignRecordToRecord($record, 'scrm_criteria_category_id', 'scrm_criteria_category_id', 'id', new SCrm_Backend_CriteriaCategory());
            } catch (Exception $e) {
                // Silent Failure
            }
        }
    }

    /**
     * Get record with relations
     *
     * @param int $id
     * @param bool $_getDeleted
     * @return Addressbook_Backend_MultipleCriteria $record 
     */
    public function get($id, $_getDeleted = FALSE){
    	$record = parent::get($id, $_getDeleted);
    	$this->appendDependentRecords($record);
        
    	return $record;
    }
    
	protected function _getSelect($_cols = '*', $_getDeleted = FALSE)
    {        
        $select = $this->_db->select();

        if (is_array($_cols) && isset($_cols['count'])) {
            $cols = array(
                'count'                => 'COUNT(*)'
            );
            
        } else {
            $cols = array_merge(
                (array)$_cols, 
                array(
                	'key'    	=> 'mc.key',
                	'name'  => 'mc.name',
                	'description'  => 'mc.description',
                	'category_name' => 'cc.name',
                	'category_key' => 'cc.key'
                )
            );
        }
        
        $select->from(array($this->_tableName => $this->_tablePrefix . $this->_tableName), $cols);
        
    	$select->joinLeft(array('mc' => $this->_tablePrefix . 'scrm_multiple_criteria'),
                    $this->_db->quoteIdentifier('mc.id') . ' = ' . $this->_db->quoteIdentifier($this->_tableName . '.scrm_multiple_criteria_id'),
                    array()); 
                    
        $select->joinLeft(array('cc' => $this->_tablePrefix . 'scrm_criteria_category'),
                    $this->_db->quoteIdentifier('cc.id') . ' = ' . $this->_db->quoteIdentifier('mc.scrm_criteria_category_id'),
                    array()); 
                    
                
        return $select;
    }
    
   /* public function getByCategory($criteriaCategoryId, $contactId = null){
    	
        $filters = array(
			array(
				'field' =>'srcm_criteria_category_id',
				'operator' => 'equals',
				'value' => $criteriaCategoryId
			)
		);
		
		$filter = new SCrm_Model_MultipleCriteriaFilter($filters, 'AND');
		$paging = new Tinebase_Model_Pagination(array(
			'sort' => 'id',
			'dir' => 'ASC'
		));
		
		$multipleCriteria = SCrm_Controller_MultipleCriteria::getInstance()->search(
			$filter, 
			$paging
		);
    	
    	
    	
    	
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
        return $this->getMultiple($relationDescriptorIds);
    }*/
}