<?php
class Addressbook_Model_ContactPerson extends Tinebase_Record_Abstract
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
    
    /**
     * list of zend inputfilter
     * 
     * this filter get used when validating user generated content with Zend_Input_Filter
     *
     * @var array
     */
    protected $_filters = array(
        'firstname' => array('StringTrim'),
        'lastname'  => array('StringTrim')
    );
    
    /**
     * list of zend validator
     * 
     * this validators get used when validating user generated content with Zend_Input_Filter
     *
     * @var array
     */
    protected $_validators = array(
        'id'                => array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => NULL),
        'contact_id'        => array(Zend_Filter_Input::ALLOW_EMPTY => false),
        'contact_person_id' => array(Zend_Filter_Input::ALLOW_EMPTY => false),
        'is_main_contact_person' => array(Zend_Filter_Input::ALLOW_EMPTY => true)
    );       
}