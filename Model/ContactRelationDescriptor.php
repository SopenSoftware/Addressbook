<?php
class Addressbook_Model_ContactRelationDescriptor extends Tinebase_Record_Abstract
{
	/**
     * degree parent
     */
    const DEGREE_PARENT = 'parent';
    /**
     * degree child
     */
    const DEGREE_CHILD = 'child';
    /**
     * degree sibling
     */
    const DEGREE_SIBLING = 'sibling';
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
        'key'                  => array('StringTrim'),
     	'name'                  => array('StringTrim'),
     	'description'                  => array('StringTrim'),
     	'degree'                  => array('StringTrim'),
    );
    
    /**
     * list of zend validator
     * 
     * this validators get used when validating user generated content with Zend_Input_Filter
     *
     * @var array
     */
    protected $_validators = array(
        'id'                   => array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => NULL),
    	'key'                  => array(Zend_Filter_Input::ALLOW_EMPTY => false),
        'name'                 => array(Zend_Filter_Input::ALLOW_EMPTY => false),
        'description'          => array(Zend_Filter_Input::ALLOW_EMPTY => true),
    	'degree'                => array('InArray' => array(self::DEGREE_PARENT, self::DEGREE_SIBLING, self::DEGREE_CHILD)),
    );    
    
    /**
     * fields to translate
     *
     * @var array
     */
    protected $_toTranslate = array(
        'name'
    );     

}