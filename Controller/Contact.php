<?php
/**
 * Tine 2.0
 *
 * @package     Addressbook
 * @subpackage  Controller
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Lars Kneschke <l.kneschke@metaways.de>
 * @copyright   Copyright (c) 2007-2008 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id: Contact.php 14550 2010-05-28 12:46:36Z f.wiechmann@metaways.de $
 *
 */

/**
 * contact controller for Addressbook
 *
 * @package     Addressbook
 * @subpackage  Controller
 */
class Addressbook_Controller_Contact extends Tinebase_Controller_Record_Abstract
{
	/**
	 * set geo data for contacts
	 *
	 * @var boolean
	 */
	protected $_setGeoDataForContacts = FALSE;

	protected $_contactContactBackend = null;
	protected $_contactRelationDescriptorBackend = null;

	/**
	 * the constructor
	 *
	 * don't use the constructor. use the singleton
	 */
	private function __construct() {
		$this->_applicationName = 'Addressbook';
		$this->_modelName = 'Addressbook_Model_Contact';
		$this->_backend = Addressbook_Backend_Factory::factory(Addressbook_Backend_Factory::SQL);
		$this->_contactContactBackend = new Addressbook_Backend_ContactContact();
		$this->_contactRelationDescriptorBackend = new Addressbook_Backend_ContactRelationDescriptor();
		$this->_currentAccount = Tinebase_Core::getUser();
		$this->_purgeRecords = FALSE;
		$this->_resolveCustomFields = TRUE;

		$this->_setGeoDataForContacts = Tinebase_Config::getInstance()->getConfig(Tinebase_Model_Config::MAPPANEL, NULL, TRUE)->value;
		if (! $this->_setGeoDataForContacts) {
			if (Tinebase_Core::isLogLevel(Zend_Log::DEBUG)) Tinebase_Core::getLogger()->debug(__METHOD__ . '::' . __LINE__ . ' Mappanel/geoext/nominatim disabled with config option.');
		}
	}

	/**
	 * don't clone. Use the singleton.
	 *
	 */
	private function __clone()
	{
	}

	/**
	 * holds the instance of the singleton
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
			self::$_instance = new Addressbook_Controller_Contact();
		}

		return self::$_instance;
	}
	
	public function suppressModlog($sup){
		$this->_ommitModLog = $sup;
	}

	/**
	 * gets binary contactImage
	 *
	 * @param int $_contactId
	 * @return blob
	 */
	public function getImage($_contactId) {
		// ensure user has rights to see image
		$this->get($_contactId);

		$image = $this->_backend->getImage($_contactId);
		return $image;
	}

	/**
	 * returns the default addressbook
	 *
	 * @return Tinebase_Model_Container
	 *
	 * @todo replace this with Tinebase_Container::getInstance()->getDefaultContainer
	 */
	public function getDefaultAddressbook()
	{
		$defaultAddressbookId = Tinebase_Core::getPreference('Addressbook')->getValue(Addressbook_Preference::DEFAULTADDRESSBOOK);
		try {
			$defaultAddressbook = Tinebase_Container::getInstance()->getContainerById($defaultAddressbookId);
		} catch (Tinebase_Exception $te) {
			Tinebase_Core::getLogger()->notice(__METHOD__ . '::' . __LINE__ . ' Create new default addressbook. (' . $te->getMessage() . ')');

			// default may be gone -> remove default adb pref
			Tinebase_Core::getPreference('Addressbook')->deleteUserPref(Addressbook_Preference::DEFAULTADDRESSBOOK);

			// generate a new one
			$defaultAddressbookId = Tinebase_Core::getPreference('Addressbook')->getValue(Addressbook_Preference::DEFAULTADDRESSBOOK);
			$defaultAddressbook = Tinebase_Container::getInstance()->getContainerById($defaultAddressbookId);
		}

		return $defaultAddressbook;
	}

	/**
	 * fetch one contact identified by $_userId
	 *
	 * @param   int $_userId
	 * @return  Addressbook_Model_Contact
	 * @throws  Addressbook_Exception_AccessDenied if user has no read grant
	 */
	public function getContactByUserId($_userId)
	{
		$contact = $this->_backend->getByUserId($_userId);
		if (!$this->_currentAccount->hasGrant($contact->container_id, Tinebase_Model_Grants::GRANT_READ)) {
			throw new Addressbook_Exception_AccessDenied('read access to contact denied');
		}
		return $contact;
	}
	
	public function getByDebitorNr($debitorNr){
		
	}

	/**
	 * can be called to activate/deactivate if geodata should be set for contacts (ignoring the config setting)
	 *
	 * @param boolean $_value
	 * @return void
	 */
	public function setGeoDataForContacts($_value)
	{
		$this->_setGeoDataForContacts = (boolean) $_value;
	}

	/**
	 * delete one record
	 * - don't delete if it belongs to an user account
	 *
	 * @param Tinebase_Record_Interface $_record
	 * @throws Addressbook_Exception_AccessDenied
	 */
	protected function _deleteRecord(Tinebase_Record_Interface $_record)
	{
		if (!empty($_record->account_id)) {
			throw new Addressbook_Exception_AccessDenied('It is not allowed to delete a contact linked to an user account!');
		}

		parent::_deleteRecord($_record);
	}

	/**
	 * (non-PHPdoc)
	 * @see Tinebase_Controller_Record_Abstract::create()
	 */
	public function create(Tinebase_Record_Interface $_record){
		parent::create($_record);
		self::customAfterCreate($_record);
		return $this->get($_record->getId());
	}

	/**
	 * (non-PHPdoc)
	 * @see Tinebase_Controller_Record_Abstract::update()
	 */
	public function update(Tinebase_Record_Interface $_record){
		parent::update($_record);
		if($_record->__get('sex')){
			$_record->__set('sex',$_record->getLetterDrawee()->getSexCode());
		}
		self::customAfterUpdate($_record);
		return $this->get($_record->getId());
	}

	/**
	 * inspect creation of one record
	 *
	 * @param   Tinebase_Record_Interface $_record
	 * @return  void
	 */
	protected function _inspectCreate(Tinebase_Record_Interface $_record)
	{
		$this->_setGeoData($_record);
		if($_record->__get('sex')){
			$_record->__set('sex',$_record->getLetterDrawee()->getSexCode());
		}
		self::customInspectCreate($_record);
	}

	/**
	 * inspect update of one record
	 *
	 * @param   Tinebase_Record_Interface $_record      the update record
	 * @param   Tinebase_Record_Interface $_oldRecord   the current persistent record
	 * @return  void
	 *
	 * @todo    check if address changes before setting new geodata
	 */
	protected function _inspectUpdate($_record, $_oldRecord)
	{
		$this->_setGeoData($_record);
		self::customInspectUpdate($_record, $_oldRecord);
	}

	/**
	 * set geodata of record
	 *
	 * @param $_record
	 * @return void
	 */
	protected function _setGeoData($_record)
	{
		return;
		if (! $this->_setGeoDataForContacts) {
			return;
		}

		if(! empty($_record->adr_one_locality)) {
			$nomination = new Zend_Service_Nominatim();

			$nomination->setVillage($_record->adr_one_locality);

			if(!empty($_record->adr_one_postalcode)) {
				$nomination->setPostcode($_record->adr_one_postalcode);
			}

			if(!empty($_record->adr_one_street)) {
				$nomination->setStreet($_record->adr_one_street);
			}

			if(!empty($_record->adr_one_countryname)) {
				$nomination->setCountry($_record->adr_one_countryname);
			}

			try {
				$places = $nomination->search();

				if(count($places) > 0) {
					$_record->lon = $places->current()->lon;
					$_record->lat = $places->current()->lat;
					if (Tinebase_Core::isLogLevel(Zend_Log::DEBUG)) Tinebase_Core::getLogger()->debug(__METHOD__ . '::' . __LINE__ . ' Place found: lon/lat ' . $_record->lon . ' / ' . $_record->lat);
				} else {
					Tinebase_Core::getLogger()->notice(__METHOD__ . '::' . __LINE__ . ' Could not find place.');
					if (Tinebase_Core::isLogLevel(Zend_Log::DEBUG)) Tinebase_Core::getLogger()->debug(__METHOD__ . '::' . __LINE__ . ' ' . $_record->adr_one_street . ', '
					. $_record->adr_one_postalcode . ', ' . $_record->adr_one_locality . ', ' . $_record->adr_one_countryname
					);
				}
			} catch (Exception $e) {
				Tinebase_Core::getLogger()->warn(__METHOD__ . '::' . __LINE__ . ' ' . $e->getMessage());
			}
		} else {
			if (Tinebase_Core::isLogLevel(Zend_Log::DEBUG)) Tinebase_Core::getLogger()->debug(__METHOD__ . '::' . __LINE__ . ' No locality given: Do not search for geodata.');
		}
	}

	public static function onSetAccountBankTransferDetected($objEvent){
		if(class_exists('Addressbook_Custom_Contact')){
    		Addressbook_Custom_Contact::onSetAccountBankTransferDetected($objEvent);
    	}else{
    		throw new ClassNotFoundException('Addressbook_Custom_Contact');
    	}
	}
	
	/**
	 *
	 * Call customized inspect create if existent
	 * @param Tinebase_Model_Contact	$_record
	 */
	protected static function customInspectCreate(Addressbook_Model_Contact $_record){
		if(class_exists('Addressbook_Custom_Contact')){
			Addressbook_Custom_Contact::inspectCreate($_record);
		}
	}
	/**
	 *
	 * Call customized after create if existent
	 * @param Tinebase_Model_Contact	$_record
	 */
	protected static function customAfterCreate(Addressbook_Model_Contact $_record){
		if(class_exists('Addressbook_Custom_Contact')){
			Addressbook_Custom_Contact::afterCreate($_record);
		}
	}
	/**
	 *
	 * Call customized inspect update if existent
	 * @param Tinebase_Model_Contact	$_record
	 */
	protected static function customInspectUpdate(Addressbook_Model_Contact $_record, Addressbook_Model_Contact $oldRecord ){
		if(class_exists('Addressbook_Custom_Contact')){
			Addressbook_Custom_Contact::inspectUpdate($_record, $oldRecord);
		}
	}
	/**
	 *
	 * Call customized after update if existent
	 * @param Tinebase_Model_Contact	$_record
	 */
	protected static function customAfterUpdate(Addressbook_Model_Contact $_record){
		if(class_exists('Addressbook_Custom_Contact')){
			Addressbook_Custom_Contact::afterUpdate($_record);
		}
	}

	public function getContactsByRelationDescriptor($relationDescriptorId, $direction){
		$aContactIds = $this->_contactContactBackend->getContactIdsByRelationDescriptor($relationDescriptorId, $direction);
		return $this->_backend->getMultiple($aContactIds);
	}

	public function getContactContactsAll($id){
		$this->_checkRight('get');
		$contactContacts = $this->_contactContactBackend->getContactContactsAll($id);
		return $contactContacts;
	}

	public function getAllRelationDescriptors(){
		//$this->_checkRight('get');
		return $this->_contactRelationDescriptorBackend->getAll();
	}

	public function createContactContact($record){
		 
		return $this->_contactContactBackend->create($record);
	}

	public function _setRightChecks($_value){
		parent::_setRightChecks($_value);
		return $this;
	}

	public function _setContainerACLChecks($_value){
		$this->_doContainerACLChecks = $_value;
		return $this;
	}

	public function getEvenDeleted($contactId){
		return $this->_backend->get($contactId, true);
	}

	public function searchByEmailAdress($email){
		$filters = array(array(
	 		'field' => 'email',
	    	'operator' => 'equals',
	    	'value' => $email)
		);
		$filters = new Addressbook_Model_ContactFilter($filters, 'AND');
		return $this->search(
			$filters,
			new Tinebase_Model_Pagination(array('sort' => 'n_fileas', 'dir' => 'ASC'))
		);
	}
	
	public function printAddressLabelsForContactIds(array $contactIds, $addressType, array $suppressCountries = null){
		$cdata = array(); 
		foreach($contactIds as $contactId){
        	$contact = $this->get($contactId);
        	$drawee = $contact->getDraweeByType($addressType);
        	if(!is_null($suppressCountries)){
        		$drawee->suppressCountries($suppressCountries);
        	}
        	
        	$cdata[] = array(
        		'adress' => $drawee->setLineBreak('<text:line-break/>')->toText()
        	);
        }
        
        $data = array(
        	'ETIKETT_TABLE' => $cdata
        );
        
        Addressbook_Controller_PrintAdressLabels::getInstance()->printLabels($data);
	}
	
	public function createAddressLabel($contactId, $addressNumber){
		
		try{
			$contact = $this->get($contactId);
			$text = $contact->getDraweeByAddressNumber($addressNumber)->toText();
			return array(
				'success' => true,
				'result' => $text
			);
		}catch(Exception $e){
			return array(
				'success' => false,
				'result' => null,
				'errorInfo' => $e->__toString()
			);
		}
	}
}
