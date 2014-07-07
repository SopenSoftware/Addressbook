<?php
class Addressbook_Model_PostalCode extends Tinebase_Record_Abstract
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
     * list of zend validator
     * 
     * this validators get used when validating user generated content with Zend_Input_Filter
     *
     * @var array
     */
    protected $_validators = array(
        'id'                    => array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => NULL),
        'country_code'                  => array(Zend_Filter_Input::ALLOW_EMPTY => false),
    	'postal_code'                  => array(Zend_Filter_Input::ALLOW_EMPTY => false),
    	'place_name'                  => array(Zend_Filter_Input::ALLOW_EMPTY => false),
        'admin_name1'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'admin_code1'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'admin_name2'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'admin_code2'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'admin_name3'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'admin_code3'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'lat'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'lon'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'acc'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true)
    );       
}