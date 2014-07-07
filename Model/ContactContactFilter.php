<?php 
class Addressbook_Model_ContactContactFilter extends Tinebase_Model_Filter_FilterGroup
{
    /**
     * @var string class name of this filter group
     *      this is needed to overcome the static late binding
     *      limitation in php < 5.3
     */
    protected $_className = 'Addressbook_Model_ContactContactFilter';
    
    /**
     * @var string application of this filter group
     */
    protected $_applicationName = 'Addressbook';
    
    /**
     * @var string name of model this filter group is designed for
     */
    protected $_modelName = 'Addressbook_Model_ContactContact';
    
    /**
     * @var array filter model fieldName => definition
     */
    protected $_filterModel = array(
        'id'                   => array('filter' => 'Tinebase_Model_Filter_Id'),
        'query'                => array(
            'filter' => 'Tinebase_Model_Filter_Query', 
            'options' => array('fields' => array('name', 'key', 'description'))
        ));
}