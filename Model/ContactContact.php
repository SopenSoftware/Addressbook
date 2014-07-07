<?php
class Addressbook_Model_ContactContact extends Tinebase_Record_Abstract
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
    	'from_contact_id'      => array(Zend_Filter_Input::ALLOW_EMPTY => false),
    	'to_contact_id'        => array(Zend_Filter_Input::ALLOW_EMPTY => false),
    	'relation_descriptor_id' => array(Zend_Filter_Input::ALLOW_EMPTY => false),
        'start_time'            => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'end_time'              => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'created_by'            => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'creation_time'         => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'last_modified_by'      => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'last_modified_time'    => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'is_deleted'            => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'deleted_time'          => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'deleted_by'            => array(Zend_Filter_Input::ALLOW_EMPTY => true),
    );    
    
    /**
     * name of fields containing datetime or or an array of datetime information
     *
     * @var array list of datetime fields
     */
    protected $_datetimeFields = array(
        'start_time',
    	'end_time',
        'creation_time',
        'last_modified_time',
        'deleted_time'
    );
}