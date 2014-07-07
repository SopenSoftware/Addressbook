<?php

class Addressbook_Backend_ContactPerson extends Tinebase_Backend_Sql_Abstract {

    /**
     * Table name without prefix
     *
     * @var string
     */
    protected $_tableName = 'contact_person';

    /**
     * Model name
     *
     * @var string
     */
    protected $_modelName = 'Addressbook_Model_ContactPerson';

    /**
     *
     * @param Tinebase_Model_Filter_FilterGroup $_filter
     * @param Tinebase_Model_Pagination $_pagination
     * @param type $_onlyIds
     * @return \Tinebase_Record_RecordSet 
     */
    public function search(Tinebase_Model_Filter_FilterGroup $_filter = NULL, Tinebase_Model_Pagination $_pagination = NULL, $_onlyIds = FALSE) {
        $recordSet = parent::search($_filter, $_pagination, $_onlyIds);
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
     * @param Addressbook_Model_ContactPerson $record Person Record
     */
    public function appendDependentRecords(Addressbook_Model_ContactPerson $record) {
        if ($record->__get('contact_person_id')) {
            try {
                $this->appendForeignRecordToRecord($record, 'contact_person_id', 'contact_person_id', 'id', Addressbook_Backend_Factory::factory(Addressbook_Backend_Factory::SQL));
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
     * @return Addressbook_Backend_ContactPerson $record 
     */
    public function get($id, $_getDeleted = FALSE){
    	$record = parent::get($id, $_getDeleted);
    	$this->appendDependentRecords($record);
        
    	return $record;
    }
}