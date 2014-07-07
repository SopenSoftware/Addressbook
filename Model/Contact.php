<?php
/**
 * Tine 2.0
 * 
 * @package     Addressbook
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Lars Kneschke <l.kneschke@metaways.de>
 * @copyright   Copyright (c) 2007-2008 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id: Contact.php 14224 2010-05-06 18:43:37Z c.weiss@metaways.de $
 *
 * @todo        rename some fields (modified, ...)
 * @todo        add relations as contact attribute
 */

/**
 * class to hold contact data
 * 
 * @package     Addressbook
 */
class Addressbook_Model_Contact extends Tinebase_Record_Abstract
{
    /**
     * const to describe contact of current account id independent
     * 
     * @var string
     */
    const CURRENTCONTACT = 'currentContact';
    
    /**
     * contact type: contact
     * 
     * @var string
     */
    const CONTACTTYPE_CONTACT = 'contact';
    
    /**
     * contact type: user
     * 
     * @var string
     */
    const CONTACTTYPE_USER = 'user';
	const LETTER_ADDRESS = 1;
	const INVOICE_ADDRESS = 2;
	const SHIPPING_ADDRESS = 3;
	
    /**
     * key in $_validators/$_properties array for the filed which 
     * represents the identifier
     * 
     * @var string
     */
    protected $_identifier = 'id';
    
    /**
     * application the record belongs to
     *
     * @var string
     */
    protected $_application = 'Addressbook';
    
    /**
     * list of zend inputfilter
     * 
     * this filter get used when validating user generated content with Zend_Input_Filter
     *
     * @var array
     */
    protected $_filters = array(
        //'*'                   => 'StringTrim',
        'adr_one_countryname'   => array('StringTrim', 'StringToUpper'),
        'adr_two_countryname'   => array('StringTrim', 'StringToUpper'),
        'adr3_countryname'   => array('StringTrim', 'StringToUpper'),
        'email'                 => array('StringTrim', 'StringToLower'),
        'email_home'            => array('StringTrim', 'StringToLower'),
        'url'                   => array('StringTrim', 'StringToLower'),
        'url_home'              => array('StringTrim', 'StringToLower'),
    );
    
    /**
     * list of zend validator
     * 
     * this validators get used when validating user generated content with Zend_Input_Filter
     *
     * @var array
     */
    protected $_validators = array(
        'created_by'            => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'creation_time'         => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'last_modified_by'      => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'last_modified_time'    => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'is_deleted'            => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'deleted_time'          => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'deleted_by'            => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_one_countryname'   => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_one_locality'      => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_one_postalcode'    => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_one_region'        => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_one_street'        => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_one_street2'       => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_two_countryname'   => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_two_locality'      => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_two_postalcode'    => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_two_region'        => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_two_street'        => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_two_street2'       => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'assistent'             => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'bday'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'calendar_uri'          => array(Zend_Filter_Input::ALLOW_EMPTY => true),
 /*     'email'     => array(
            array(
                'Regex', 
                '/^[^0-9][a-z0-9_]+([.][a-z0-9_]+)*[@][a-z0-9_]+([.][a-z0-9_]+)*[.][a-z]{2,4}$/'
            ), 
            Zend_Filter_Input::ALLOW_EMPTY => true
        ),
        'email_home'     => array(
            array(
                'Regex', 
                '/^[^0-9][a-z0-9_]+([.][a-z0-9_]+)*[@][a-z0-9_]+([.][a-z0-9_]+)*[.][a-z]{2,4}$/'
            ), 
            Zend_Filter_Input::ALLOW_EMPTY => true
        ),*/
        'email'                 => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'email_home'            => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'jpegphoto'             => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'freebusy_uri'          => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'id'                    => array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => NULL),
        'account_id'            => array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => NULL),
        'responsible_id'        => array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => NULL),
        'note'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'container_id'          => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'role'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'salutation_id'         => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'title'                 => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'url'                   => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'url_home'              => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'n_family'              => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'n_fileas'              => array(Zend_Filter_Input::ALLOW_EMPTY => false, 'presence'=>'required'),
        'n_fn'                  => array(Zend_Filter_Input::ALLOW_EMPTY => false, 'presence'=>'required'),
        'n_given'               => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'n_middle'              => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'n_prefix'              => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'n_suffix'              => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'org_name'              => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'org_unit'              => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'pubkey'                => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'room'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'tel_assistent'         => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'tel_car'               => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'tel_cell'              => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'tel_cell_private'      => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'tel_fax'               => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'tel_fax_home'          => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'tel_home'              => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'tel_pager'             => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'tel_work'              => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'tz'                    => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'lon'                   => array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => 0),
        'lat'                   => array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => 0),
    // tine 2.0 generic fields
        'tags'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'notes'                 => array(Zend_Filter_Input::ALLOW_EMPTY => true),
	'relations'             => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'customfields'          => array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => array()),
        'type'                  => array(
            Zend_Filter_Input::ALLOW_EMPTY => true, 
            'InArray' => array(self::CONTACTTYPE_USER, self::CONTACTTYPE_CONTACT)
        ),
 // [EXTEND HH]: bankaccount data 2009-07-10 and letter salutation
 		'letter_salutation'   => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'bank_account_number'   => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'bank_code'             => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'bank_account_name'     => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'bank_name'             => array(Zend_Filter_Input::ALLOW_EMPTY => true),
    	'busy_is_letter_address'=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
     	'busy_is_shipping_address'=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
     	'busy_is_invoice_address'=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
// EXTENDED CONTACT: 2010-04-20: vendor management etc.
    	'company2'=>array(Zend_Filter_Input::ALLOW_EMPTY => true),
    	'adr3_addition'=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
	    'adr3_street'=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
	    'adr3_postal_code'=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
	    'adr3_countryname'=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
	    'adr3_location'=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
	    'creditor_ext_id'=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
	    'debitor_ext_id'=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
	    'main_category_contact_id'=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'contact_source_id'=> array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => 0),
        'adr3_is_letter_address'=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
     	'adr3_is_shipping_address'=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
     	'adr3_is_invoice_address'=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
// EXTENDED CONTACT: 2010-05-01: CRM tab
    	'sodiac_sign'=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        
// EXTENDED CONTACT: 2010-06-29: CRM tab    KSK for Orders
		'ksk'=> array(Zend_Filter_Input::ALLOW_EMPTY => true,Zend_Filter_Input::DEFAULT_VALUE => 0),
        
// EXTENDED CONTACT: 2010-10-07: VDST assoc shape        
    	'contact_type'          => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'orga_type_id'          => array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => 0),
        'invoice_receiver'      => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'shipping_receiver'     => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'form_of_address'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'is_manual_form' => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'is_manual_salutation' => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_one_co'  			=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_two_co'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr3_co'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'sex'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'is_locked'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'lock_comment'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'lock_date'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
// EXTENDED CONTACT: 2012-04-27: VDST go live        
        'adr4_addition'          => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr4_street'          => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr4_postal_code'      => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr4_location'     => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr4_countryname'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr4_co' => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'tel_fax3' => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'tel_fax4'  			=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'tel3'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'email3'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'email4'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'url3'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr4_is_letter_address'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr4_is_shipping_address'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr4_is_invoice_address'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
// EXTENDED CONTACT: 2012-09-07: NRW go live        
        'person_leading'          => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'you_salutation'          => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'nationality'      => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'official_title'     => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_one_postbox'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_one_postbox_postal_code' => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_one_use_postbox' => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_two_postbox'  			=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_two_postbox_postal_code'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_two_use_postbox'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr3_postbox'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr3_postbox_postal_code'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr3_use_postbox'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr4_postbox'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr4_postbox_postal_code'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr4_use_postbox'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_one_label'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr_two_label'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr3_label'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'adr4_label'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'is_affiliator'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'affiliate_contact_id'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'affiliator_provision'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'affiliator_provision_date'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'is_affiliated'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'count_magazines'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'count_additional_magazines'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'partner_forename'          => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'partner_lastname'          => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'partner_title'      => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'partner_salutation_id'     => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'partner_birthday'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'partner_sex' => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'contact_source' => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'province'  			=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'district'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'county'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'community'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'community_key'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'cultural_area'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'user_former_system'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'is_imported'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'info_letter_date'  		=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'company3'=>array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'contact_multiple_criteria_id' => array(Zend_Filter_Input::ALLOW_EMPTY => true)
    );
    
    /**
     * name of fields containing datetime or or an array of datetime information
     *
     * @var array list of datetime fields
     */
    protected $_datetimeFields = array(
       // 'bday',
        'creation_time',
        'last_modified_time',
        'deleted_time'
    );
    
    public function appendDependentRecords($record) {
        Tinebase_User::getInstance()->resolveUsers($record, 'responsible_id'); 
    }
    
    /**
     * wrapper for setFromJason which expects datetimes in array to be in
     * users timezone and converts them to UTC
     *
     * @todo move this to a generic __call interceptor setFrom<API>InUsersTimezone
     * 
     * @param  string $_data json encoded data
     * @throws Tinebase_Exception_Record_Validation when content contains invalid or missing data
     */
    public function setFromJsonInUsersTimezone($_data)
    {
        // change timezone of current php process to usertimezone to let new dates be in the users timezone
        // NOTE: this is neccessary as creating the dates in UTC and just adding/substracting the timeshift would
        //       lead to incorrect results on DST transistions 
        
        // TODO BUGBUG: remove setting of timezone to UTC
        // -> was done, to hack out birthday bug  
        
        //date_default_timezone_set(Tinebase_Core::get(Tinebase_Core::USERTIMEZONE));
		date_default_timezone_set('UTC');
        
		// NOTE: setFromArray creates new Zend_Dates of $this->datetimeFields
        $this->setFromJson($_data);
        
        // convert $this->_datetimeFields into the configured server's timezone (UTC)
        $this->setTimezone('UTC');
        
        // finally reset timzone of current php process to the configured server timezone (UTC)
        date_default_timezone_set('UTC');
    }
    
    /**
     * returns prefered email address of given contact
     *
     * @return string
     */
    public function getPreferedEmailAddress()
    {
        // prefer work mail over private mail till we have prefs for this
        return $this->email ? $this->email : $this->email_home;
    }
    
    /**
     * (non-PHPdoc)
     * @see Tinebase/Record/Tinebase_Record_Abstract#setFromArray($_data)
     */
    public function setFromArray(array $_data)
    {
        if (!isset($_data['n_family']) && !isset($_data['org_name'])) {
            $_data['org_name'] = '';
        }
        
        // always update fileas and fn
        $_data['n_fileas'] = (!empty($_data['n_family'])) ? $_data['n_family'] : $_data['org_name'];
        if (!empty($_data['n_given'])) {
            $_data['n_fileas'] .= ', ' . $_data['n_given'];
        }
            
        $_data['n_fn'] = (!empty($_data['n_family'])) ? $_data['n_family'] : $_data['org_name'];
        if (!empty($_data['n_given'])) {
            $_data['n_fn'] = $_data['n_given'] . ' ' . $_data['n_fn'];
        }
	if(empty($_data['info_letter_date']) || $_data['info_letter_date']==""){
			$_data['info_letter_date'] = null;
		}
    	if(empty($_data['lock_date']) || $_data['lock_date']==""){
			$_data['lock_date'] = null;
		}
     if(empty($_data['bday']) || $_data['bday']==""){
			$_data['bday'] = null;
		}
   		 if(empty($_data['partner_birthday']) || $_data['partner_birthday']==""){
			$_data['partner_birthday'] = null;
		}
   	 if(empty($_data['affiliator_provision_date']) || $_data['affiliator_provision_date']==""){
			$_data['affiliator_provision_date'] = null;
		}
     if(empty($_data['info_letter_date']) || $_data['info_letter_date']==""){
			$_data['info_letter_date'] = null;
		}
    if(empty($_data['affiliate_contact_id']) || $_data['affiliate_contact_id']==""){
			$_data['affiliate_contact_id'] = null;
		}
        parent::setFromArray($_data);
    }
    
    /**
     * converts a int, string or Addressbook_Model_Contact to an contact id
     *
     * @param   int|string|Addressbook_Model_Contact $_contactId the contact id to convert
     * @return  int
     * @throws  UnexpectedValueException if no contact id set or 0
     */
    static public function convertContactIdToInt($_contactId)
    {
        if ($_contactId instanceof Addressbook_Model_Contact) {
            if (empty($_contactId->id)) {
                throw new UnexpectedValueException('No contact id set.');
            }
            $id = (string) $_contactId->id;
        } else {
            $id = (string) $_contactId;
        }
        
        if ($id == '') {
            throw new UnexpectedValueException('Contact id can not be 0.');
        }
        
        return $id;
    }
    
    /**
     * fills a contact from json data
     *
     * @todo timezone conversion for birthdays?
     * @param array $_data record data
     * @return void
     * 
     * @todo check in calling functions where these tags/notes/container arrays are coming from and get down to the root of the trouble    
     */
    protected function _setFromJson(array &$_data)
    {
        if (isset($_data['jpegphoto'])) {
            if ($_data['jpegphoto'] != '') {
                $imageParams = Tinebase_ImageHelper::parseImageLink($_data['jpegphoto']);
                if ($imageParams['isNewImage']) {
                    try {
                        $_data['jpegphoto'] = Tinebase_ImageHelper::getImageData($imageParams);
                    } catch(Tinebase_Exception_UnexpectedValue $teuv) {
                        Tinebase_Core::getLogger()->warn(__METHOD__ . '::' . __LINE__ . ' Could not add contact image: ' . $teuv->getMessage());
                        unset($_data['jpegphoto']);
                    }
                } else {
                    unset($_data['jpegphoto']);
                }
            }
        }
        
        // unset if empty
        if (empty($_data['id'])) {
            unset($_data['id']);
        }
    	if(empty($_data['lock_date']) || $_data['lock_date']==""){
			$_data['lock_date'] = null;
		}
     if(empty($_data['partner_birthday']) || $_data['partner_birthday']==""){
			$_data['partner_birthday'] = null;
		}
    }
private function getAddressFieldsByNumber($number){
    	
		$prefixes = array(
			1 => 'adr_one',
			2 => 'adr_two',
			3 => 'adr3',
			4 => 'adr4'
		);
    	
		$adr = $prefixes[$number].'_';
		
		$pField = 'postalcode';
    	$lField = 'locality';
    	
    	if($number>2){
    		$pField = 'postal_code';
    		$lField = 'location';
    	}
    	
    	return array(
    			'co'	=> $this->__get($adr.'co'),
    			'street' => $this->__get($adr.'street'),
    			'postalcode' => $this->__get($adr.$pField),
    			'postbox' => $this->__get($adr.'postbox'),
    			'postbox_postalcode' => $this->__get($adr.'postbox_postal_code'),
    			'use_postbox' => $this->__get($adr.'use_postbox'),
    			'location' => $this->__get($adr.$lField),
    			'country_code' => $this->__get($adr.'countryname'),
    			'country' => Tinebase_Translation::getCountryNameByRegionCode($this->__get($adr.'countryname'))
    		);
		
    }
    
	public function getDraweeByAddressNumber($number){
    	$aAddress = $this->getAddressFieldsByNumber($number);
    	$postalAddress = Addressbook_Model_PostalAddress::createFromArray($aAddress);
    	$aDrawee = $this->getDraweeFields();
    	$drawee = Addressbook_Model_Drawee::createFromArray($aDrawee,$postalAddress);
    	
    	$prefixes = array(
			1 => 'adr_one',
			2 => 'adr_two',
			3 => 'adr3',
			4 => 'adr4'
		);
		$prefix = $prefixes[$number].'_';
		if($this->__get($prefix . 'label') != ''){
    		$drawee->setFixDraweeText($this->__get($prefix . 'label'));
    	}
    	return $drawee;
    }
    
    private function getFixedDraweeByType($type=self::LETTER_ADDRESS){
    	$prefix = $this->getPrefixByType($type);
    	if($this->__get($prefix . 'label') != ''){
    		return $this->__get($prefix . 'label');
    	}
    	return null;
    }
    
    private function getPrefixByType($type=self::LETTER_ADDRESS){
    	$adr = 'adr_one_';
    	
    	switch($type){
    		
	    	case self::LETTER_ADDRESS:
    			if($this->__get('busy_is_letter_address')==false){
	    			$adr = 'adr_two_';
	    		}
	    		if($this->__get('adr3_is_letter_address')== true){
	    			$adr = 'adr3_';
	    		}
	    		break;
	    		
	    	case self::SHIPPING_ADDRESS:
    			if($this->__get('busy_is_shipping_address')==false){
	    			$adr = 'adr_two_';
	    		}
	    		if($this->__get('adr3_is_shipping_address')== true){
	    			$adr = 'adr3_';
	    		}
	    		break;
	    		
	    	case self::INVOICE_ADDRESS:
    			if($this->__get('busy_is_invoice_address')==false){
	    			$adr = 'adr_two_';
	    		}
	    		if($this->__get('adr3_is_invoice_address')== true){
	    			$adr = 'adr3_';
	    		}
	    		break;
	    		
    	}
    	
    	return $adr;
    }
    
    private function getAddressFields($type=self::LETTER_ADDRESS){
    	$pField = 'postalcode';
    	$lField = 'locality';
    	switch($type){
	    	case self::LETTER_ADDRESS:
	    		$adr = 'adr_one_';
	    		
	    		if($this->__get('busy_is_letter_address')==false){
	    			$adr = 'adr_two_';
	    		}
	    		if($this->__get('adr3_is_letter_address')== true){
	    			$adr = 'adr3_';
	    			$pField = 'postal_code';
	    			$lField = 'location';
	    		}
	    		$aAddress = array(
	    			'co'	=> $this->__get($adr.'co'),
	    			'street' => $this->__get($adr.'street'),
	    			'postalcode' => $this->__get($adr.$pField),
	    			'postbox_postalcode' => $this->__get($adr.'postbox_postal_code'),
	    			'use_postbox' => $this->__get($adr.'use_postbox'),
	    			'postbox' => $this->__get($adr.'postbox'),
	    			'location' => $this->__get($adr.$lField),
	    			'country_code' => $this->__get($adr.'countryname'),
	    			'country' => Tinebase_Translation::getCountryNameByRegionCode($this->__get($adr.'countryname'))
	    		);
	    	break;
	    	case self::SHIPPING_ADDRESS:
	    		$adr = 'adr_one_';
	    		if($this->__get('busy_is_shipping_address')==false){
	    			$adr = 'adr_two_';
	    		}
	    		if($this->__get('adr3_is_shipping_address')== true){
	    			$adr = 'adr3_';
	    			$pField = 'postal_code';
	    			$lField = 'location';
	    		}
	    		$aAddress = array(
	    			'co'	=> $this->__get($adr.'co'),
	    			'street' => $this->__get($adr.'street'),
	    			'postalcode' => $this->__get($adr.$pField),
	    			'postbox_postalcode' => $this->__get($adr.'postbox_postal_code'),
	    			'use_postbox' => $this->__get($adr.'use_postbox'),
	    			'postbox' => $this->__get($adr.'postbox'),
	    			'location' => $this->__get($adr.$lField),
	    			'country_code' => $this->__get($adr.'countryname'),
	    			'country' => Tinebase_Translation::getCountryNameByRegionCode($this->__get($adr.'countryname'))
	    		);
	    	break;
	    	case self::INVOICE_ADDRESS:
	    		$adr = 'adr_one_';
	    		if($this->__get('busy_is_invoice_address')==false){
	    			$adr = 'adr_two_';
	    		}
	    		if($this->__get('adr3_is_invoice_address')== true){
	    			$adr = 'adr3_';
	    			$pField = 'postal_code';
	    			$lField = 'location';
	    		}
	    		$aAddress = array(
	    			'co'	=> $this->__get($adr.'co'),
	    			'street' => $this->__get($adr.'street'),
	    			'postalcode' => $this->__get($adr.$pField),
	    			'postbox_postalcode' => $this->__get($adr.'postbox_postal_code'),
	    			'use_postbox' => $this->__get($adr.'use_postbox'),
	    			'postbox' => $this->__get($adr.'postbox'),
	    			'location' => $this->__get($adr.$lField),
	    			'country_code' => $this->__get($adr.'countryname'),
	    			'country' => Tinebase_Translation::getCountryNameByRegionCode($this->__get($adr.'countryname'))
	    		);
	    	break;	    		    	
    	}
    	return $aAddress;
    }
    
    private function getDraweeFields(){
   		$titles = Addressbook_Controller_SoContactTitle::getInstance()->getSoContactTitles();
		$aTitles = $titles->toArray();
		$title = null;
		foreach($aTitles as $titleRecord){
			if($titleRecord['id'] == $this->__get('n_prefix')){
				$title = $titleRecord['name'];
				break;
			}
		}
    	$partnerTitle = null;
		foreach($aTitles as $titleRecord){
			if($titleRecord['id'] == $this->__get('partner_title')){
				$partnerTitle = $titleRecord['name'];
				break;
			}
		}
    	return array(
    		'salutation' => $this->__get('salutation_id'),
    		'company1' => $this->__get('org_name'),
    		'company2' => $this->__get('company2'),
    		'company3' => $this->__get('company3'),
    		'title' => $title,
    		'forename' => $this->__get('n_given'),
    		'lastname' => $this->__get('n_family'),
    		'form_of_address'  => $this->__get('form_of_address'),
    		'partner_salutation' => $this->__get('partner_salutation_id'),
    		'partner_title' => $partnerTitle,
    		'partner_forename' => $this->__get('partner_forename'),
    		'partner_lastname' => $this->__get('partner_lastname'),
    	);
    }
    
    public function getLetterAddress(){
    	$aAddress = $this->getAddressFields(self::LETTER_ADDRESS);
    	$postalAddress = Addressbook_Model_PostalAddress::createFromArray($aAddress);
    	return $postalAddress;
    }
    
    public function getLetterDrawee(){
    	$aDrawee = $this->getDraweeFields();

    	$postalAddress = $this->getLetterAddress();
    	$drawee = Addressbook_Model_Drawee::createFromArray($aDrawee,$postalAddress);
		$drawee->setFixDraweeText($this->getFixedDraweeByType(self::LETTER_ADDRESS));
    	
    	return $drawee;
    }
    
 	public function getDraweeByType($addressType){
   		switch($addressType){
        	case Addressbook_Model_Contact::LETTER_ADDRESS:
        		return $this->getLetterDrawee();
        	case Addressbook_Model_Contact::SHIPPING_ADDRESS:
        		return $this->getShippingDrawee();
        	case Addressbook_Model_Contact::INVOICE_ADDRESS:
        		return $this->getInvoiceDrawee();
        }
    }
    
    public function getInvoiceAddress(){
        $aAddress = $this->getAddressFields(self::INVOICE_ADDRESS);
    	$postalAddress = Addressbook_Model_PostalAddress::createFromArray($aAddress);
    	return $postalAddress;
    }
    
    public function getInvoiceDrawee(){
    	$aDrawee = $this->getDraweeFields();

    	$postalAddress = $this->getInvoiceAddress();
    	
    	$drawee = Addressbook_Model_Drawee::createFromArray($aDrawee,$postalAddress);
		$drawee->setFixDraweeText($this->getFixedDraweeByType(self::INVOICE_ADDRESS));
    	return $drawee;
    }
    
    public function getShippingAddress(){
        $aAddress = $this->getAddressFields(self::SHIPPING_ADDRESS);
    	$postalAddress = Addressbook_Model_PostalAddress::createFromArray($aAddress);
    	return $postalAddress;
    }
    
    public function getShippingDrawee(){
    	$aDrawee = $this->getDraweeFields();

    	$postalAddress = $this->getShippingAddress();
    	$drawee = Addressbook_Model_Drawee::createFromArray($aDrawee,$postalAddress);
		$drawee->setFixDraweeText($this->getFixedDraweeByType(self::SHIPPING_ADDRESS));
    	
    	return $drawee;
    }
    
    public function getProperty($name){
    	return $this->__get($name);
    }
    
    public function calculateAgeAsYears($dateAgeAsOf = null, $dateFormat = 'YYYY-MM-dd'){
    	return $this->calculateAge(Zend_Date::YEAR, $dateAgeAsOf, $dateFormat );
    }
    
    public function calculateAge($mode = Zend_Date::YEAR, $dateAgeAsOf = null, $dateFormat = 'YYYY-MM-dd'){
    	if(is_null($dateAgeAsOf)){
    		$dateAgeAsOf = new Zend_Date(); // today
    	}elseif(!($dateAgeAsOf instanceof Zend_Date)){
    		$dateAgeAsOf = new Zend_Date($dateAgeAsOf, $dateFormat);
    	}
    	$dateDOB = new Zend_Date($this->__get('bday'));
    	$diff = $dateAgeAsOf->sub( $dateDOB );
    	return floor($diff / 3600 / 24 / 365);
    }
    
    public function getContactNumber(){
    	return $this->getId();
    }
    
    public function getSexShort(){
    	return $this->getLetterDrawee()->getSexShort();
    }
    
	public function getSexLong(){
    	return $this->getLetterDrawee()->getSexLong();
    }
    
    public function getShortName(){
    	$shortName = null;
    	if(strlen($this->__get('n_given'))>0){
    		$shortName = substr($this->__get('n_given'),0,1).'.';
    	}
    	$shortName .= $this->__get('n_family');
    	return $shortName;
    }
    
    /**
     * 
     * Enter description here ...
     * @param unknown_type $contact
     */
    public function grabPersonFrom(Addressbook_Model_Contact $contact){
    	$this->__set('salutation_id', $contact->__get('salutation_id'));
    	$this->__set('title', $contact->__get('title'));
    	$this->__set('n_given', $contact->__get('n_given'));
    	$this->__set('n_family', $contact->__get('n_family'));
    	$this->__set('letter_salutation', $contact->__get('letter_salutation'));
    	$this->__set('n_prefix', $contact->__get('n_prefix'));
    	$this->__set('form_of_address', $contact->__get('form_of_address'));
    }
}