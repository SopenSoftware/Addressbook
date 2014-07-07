<?php
/**
 * Tine 2.0
 * 
 * @package     Addressbook
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schuele <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2007-2008 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id: Salutation.php 5446 2008-11-14 07:52:08Z c.weiss@metaways.de $
 *
 */
function soTest($value){
		if(is_string($value) && $value==""){
			$value = null;
		}
		return $value;
}
/**
 * class to hold salutation data
 * 
 * @package     Addressbook
 */
class Addressbook_Model_SoMember extends Tinebase_Record_Abstract
{
	/**
     * key in $_validators/$_properties array for the filed which 
     * represents the identifier
     * 
     * @var string
     */
    protected $_identifier = 'contact_id';
    
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
    );
    
    /**
     * name of fields containing datetime or or an array of datetime information
     *
     * @var array list of datetime fields
     */
    protected $_datetimeFields = array(
        'begin_datetime',
        'discharge_datetime',
        'termination_datetime'
    );
    /**
     * list of zend validator
     * 
     * this validators get used when validating user generated content with Zend_Input_Filter
     *
     * @var array
     * 	
     */
    protected $_validators = array(
        'contact_id'            	=> array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => NULL),
        'begin_datetime'            => array(Zend_Filter_Input::ALLOW_EMPTY => false),
     	'discharge_datetime'        => array(Zend_Filter_Input::ALLOW_EMPTY => true),
     	'termination_datetime'      => array(Zend_Filter_Input::ALLOW_EMPTY => true),
     	'so_entry_reason_id'       => array('allowEmpty' => false, 'Int'),
     	'so_termination_reason_id'  => array('allowEmpty' => true,  'Int'),
     	'so_member_affiliate_id'  	=> array('allowEmpty' => false, 'Int'),
     	'so_fee_category_id'        => array('allowEmpty' => false, 'Int'),
     	'yearly_fee'                => array(Zend_Filter_Input::ALLOW_EMPTY => false, Zend_Filter_Input::DEFAULT_VALUE => NULL),
     	'total_items_balance'		=> array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => 0),
     	'so_fee_payment_interval_id' => array('allowEmpty' => false, 'Int'),
     	'so_fee_payment_method_id'   => array('allowEmpty' => false, 'Int'),
    	'directorate' 				=> array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => false),
    	'func_directorate_id' 		=> array('allowEmpty' => true, 'Int'),
	    'management_board' 			=> array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => false),
	    'func_management_board_id' 	=> array('allowEmpty' => true, 'Int'),
	    'advisory_board' 			=> array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => false),
	    'func_advisory_board_id' 	=> array('allowEmpty' => true, 'Int'),
	    'main_tec_committee' 		=> array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => false),
	    'func_main_tec_committee_id' => array('allowEmpty' => true, 'Int')
    );    

    /**
     * fields to translate
     *
     * @var array
     */
    protected $_toTranslate = array(
    );        
    
    public function setFromArray(array $_data){
    	$_data['so_termination_reason_id'] = soTest($_data['so_termination_reason_id']);
    	$_data['total_items_balance'] = soTest($_data['total_items_balance']);
    	$_data['func_directorate_id'] = soTest($_data['func_directorate_id']);
    	$_data['func_management_board_id'] = soTest($_data['func_management_board_id']);
    	$_data['func_advisory_board_id'] = soTest($_data['func_advisory_board_id']);
    	$_data['func_main_tec_committee_id'] = soTest($_data['func_main_tec_committee_id']);
    	parent::setFromArray($_data);
    }
}
