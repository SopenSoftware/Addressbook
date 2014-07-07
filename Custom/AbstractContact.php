<?php 
/**
 * 
 * Holds custom contact functions
 * @author hhartl
 *
 */
abstract class Addressbook_Custom_AbstractContact{
	/**
	 * 
	 * Inspect controller create
	 * @param Tinebase_Model_Contact $record
	 */
	abstract public static function inspectCreate(Addressbook_Model_Contact $record);
	/**
	 * 
	 * Called after controller created new contact
	 * @param Tinebase_Model_Contact $record
	 */
	abstract public static function afterCreate(Addressbook_Model_Contact $record);
	
	/**
	 * 
	 * Inspect controller update
	 * @param Tinebase_Model_Contact $record
	 */
	//abstract public static function inspectUpdate(Addressbook_Model_Contact $record, Addressbook_Model_Contact $oldRecord);
	
	/**
	 * 
	 * Called after controller created new contact
	 * @param Tinebase_Model_Contact $record
	 */
	abstract public static function afterUpdate(Addressbook_Model_Contact $record);
	
	/**
	 * 
	 * Check debitor ext id
	 * @param int $debitorExtId
	 * @param int $contactId
	 * @return bool	valid|invalid	true|false
	 */
	abstract public static function checkDebitorUnique($debitorExtId, $contactId);
	
	
    public static function getDuplicateSearchFilter(array $recordData, &$filter)
    {
    	$filter = null;
    	
        if (empty($recordData['n_given']) && empty($recordData['n_family'])) {
            // check organisation duplicates if given/fullnames are empty
            if(empty($recordData['org_name'])){
            	return false;
            }
        	$filter = new Addressbook_Model_ContactFilter(array(
                array('field' => 'org_name',        'operator' => 'equals', 'value' => $recordData['org_name'])
            ));
        } else {
         	if(empty($recordData['n_family']) /*|| empty($recordData['adr_one_postalcode']) || empty($recordData['adr_one_street'])*/){
            	return false;
            }
            $filter = new Addressbook_Model_ContactFilter(array(
                array('field' => 'n_given',        'operator' => 'equals', 'value' => $recordData['n_given']),
	    
                array('field' => 'n_family',        'operator' => 'equals', 'value' => $recordData['n_family']),
                array('field' => 'adr_one_postalcode',        'operator' => 'equals', 'value' => $recordData['adr_one_postalcode']),
                array('field' => 'adr_one_street',        'operator' => 'equals', 'value' => $recordData['adr_one_street'])
            ));
        }
    	if(array_key_exists('id', $recordData) && $recordData['id']!=0){
    		$filter->addFilter($filter->createFilter('id','notin',array($recordData['id'])));
    	}
        
        return true;
    }
    
	public function inspectCreateDebitor($debitor){
		
	}
	
	public function inspectUpdateDebitor($debitor){
		
	}
}
?>