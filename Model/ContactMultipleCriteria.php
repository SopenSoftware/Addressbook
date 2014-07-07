<?php
class Addressbook_Model_ContactMultipleCriteria extends Tinebase_Record_Abstract
{
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
    
    protected $_validators = array(
        'id'                   => array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => NULL),
    	'contact_id'      => array(Zend_Filter_Input::ALLOW_EMPTY => false),
    	'scrm_multiple_criteria_id'        => array(Zend_Filter_Input::ALLOW_EMPTY => false),
    	'scrm_criteria_category_id' => array(Zend_Filter_Input::ALLOW_EMPTY => false),
        'has_criteria'            => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'percentage'              => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'key'              => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'name'              => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'description'              => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'category_key'              => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'category_name'              => array(Zend_Filter_Input::ALLOW_EMPTY => true)    
    );    
    
    /**
     * name of fields containing datetime or or an array of datetime information
     *
     * @var array list of datetime fields
     */
    protected $_datetimeFields = array(
    );
    
   /* public static function createFromSCrmMultipleCriteria( SCrm_Model_MultipleCriteria $mc ){
    	$obj = new self();
    	$obj->__set('scrm_multiple_criteria_id', $mc->__get('scrm_multiple_criteria_id'));
    	$obj->__
    }*/
}