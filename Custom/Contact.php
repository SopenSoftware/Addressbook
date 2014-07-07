<?php 
/**
 * 
 * Holds custom contact functions
 * 
 * 
 * In shape agency: open3A factura is still in use,
 * therefore we use the Open3A module to handle debitor functions
 * 
 * @author hhartl
 *
 */
class Addressbook_Custom_Contact extends Addressbook_Custom_AbstractContact{
	/**
	 * 
	 * Inspect controller create
	 * @param Tinebase_Model_Contact $record
	 */
	public static function inspectCreate(Addressbook_Model_Contact $record){
		return;
		if( !CSopen::instance()->getModule('Open3A')->isInstalled()){
			return;
		}
		//
		if($record->__get('debitor_ext_id')==null){
			return;
		}
		if(!self::boolCheckDebitorUnique($record->__get('debitor_ext_id'), null)){
			$record->__set('debitor_ext_id',null);
		}
	}
	
	/**
	 * 
	 * Called immediately after a new contact is created and has an ID (pk) already
	 * @param Tinebase_Model_Contact $record
	 */
	public static function afterCreate(Addressbook_Model_Contact $record){
		// do nothing
	}
	
	/**
	 * 
	 * Inspect controller update
	 * @param Tinebase_Model_Contact $record
	 */
	public static function inspectUpdate(Addressbook_Model_Contact $record, $oldRecord){
		return;
		if( !CSopen::instance()->getModule('Open3A')->isInstalled()){
			return;
		}
		if($record->__get('debitor_ext_id')==null){
			return;
		}
		if(!self::boolCheckDebitorUnique($record->__get('debitor_ext_id'), $record->__get('id'))){
			$record->__set('debitor_ext_id',null);
		}
	}
	
	/**
	 * 
	 * Called immediately after a contact is updated
	 * @param Tinebase_Model_Contact $record
	 */
	public static function afterUpdate(Addressbook_Model_Contact $record){
		// do nothing
	}
	
	/**
	 * 
	 * Set the debitor ext id to the value of contact id
	 * @param Tinebase_Model_Contact $record
	 */
	public static function setDebitorExtId(Addressbook_Model_Contact $record){
		// do nothing, debitor-Number is given manually
	}
	
	/**
	 * 
	 * Boolean check on debitor unique
	 * @param int $debitorExtId
	 * @param int $contactId
	 */
	public static function boolCheckDebitorUnique($debitorExtId, $contactId){
		$result = self::checkDebitorUnique($debitorExtId, $contactId);
		return $result['success'];
	}
	
	/**
	 * 
	 * Check debitor unique
	 * @param int $debitorExtId
	 * @param int $contactId
	 */
	public static function checkDebitorUnique($debitorExtId, $contactId){
		$successData = array(
			'data'       => array(
    			'contact_id' => $contactId,
    			'n_fileas' => null,
				'org_name' => null,
				'company2' => null,
				'debitor_ext_id' => $debitorExtId
    		),
			'success' 	 => true
		);
		try{
    		$facturaModule = CSopen::instance()->getModule('Open3A');
    		if(!$facturaModule->isInstalled()){
    			return $successData;
    		}
    	}catch(Exception $e){
    		return $successData;
    	}
    	$debitorExists = $facturaModule->checkDebitorUnique($debitorExtId, &$debContactId);
    	$n_fileas = null;
    	$checkFailed = false;

    	if($debitorExists && ($contactId != $debContactId)){
    		$contact = Addressbook_Controller_Contact::getInstance()->getEvenDeleted($debContactId);
    		// if the corresponding addressbok item is already deleted -> delete also kappendix
    		if($contact->__get('is_deleted') ){
    			$facturaModule->deleteKappendix($debContactId);
    			$n_fileas = $org_name = $company2 = null;
    			$checkFailed = false;
    		}else{
	    		$n_fileas = $contact->__get('n_fileas');
	    		$org_name = $contact->__get('org_name');
	    		$company2 = $contact->__get('company2');
	    		$checkFailed = true;
    		}
    	}
    	
    	$successData = array(
			'data'       => array(
    			'contact_id' => $debContactId,
    			'n_fileas' => $n_fileas,
    			'org_name' => $org_name,
    			'company2' => $company2,
    			'debitor_ext_id' => $debitorExtId
    		),
			'success' 	 => !$checkFailed
		);
    	
    	return $successData;
	}
	
	public static function onSetAccountBankTransferDetected($objEvent){
		
		// set tag for instance!!
		// should be done in customizing, as there is no global tag for debit return yet 
		
		/*$contactId = $objEvent->getDebitor()->getForeignId('contact_id');
		$contact = Addressbook_Controller_Contact::getInstance()->get($contactId);
		
		$tag = Tinebase_Tags::getInstance()->getTagByName('Rücklastschrift');
		
		$contactTags = Tinebase_Tags::getInstance()->getTagsOfRecord($contact);
		$contactTags->addRecord(Tinebase_Tags::getInstance()->getTagByName('Rücklastschrift'));
		$contact->__set('tags', $contactTags);
		
		Addressbook_Controller_Contact::getInstance()->update($contact);*/
	}
	
	
}
?>