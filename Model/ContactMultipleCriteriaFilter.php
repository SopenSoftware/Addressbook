<?php 
class Addressbook_Model_ContactMultipleCriteriaFilter extends Tinebase_Model_Filter_FilterGroup
{
    /**
     * @var string class name of this filter group
     *      this is needed to overcome the static late binding
     *      limitation in php < 5.3
     */
    protected $_className = 'Addressbook_Model_ContactMultipleCriteriaFilter';
    
    /**
     * @var string application of this filter group
     */
    protected $_applicationName = 'Addressbook';
    
    /**
     * @var string name of model this filter group is designed for
     */
    protected $_modelName = 'Addressbook_Model_ContactMultipleCriteria';
    
    /**
     * @var array filter model fieldName => definition
     */
    protected $_filterModel = array(
        'id'                   => array('filter' => 'Tinebase_Model_Filter_Id'),
        'query'                => array(
            'filter' => 'Tinebase_Model_Filter_Query', 
            'options' => array('fields' => array('id'/*'name','key', 'description'*/ ))
        ),
        'contact_id' => array('filter' => 'Tinebase_Model_Filter_ForeignId', 
            'options' => array(
                'filtergroup'       => 'Addressbook_Model_ContactFilter', 
                'controller'        => 'Addressbook_Controller_Contact'
            )
        ),
        'scrm_criteria_category_id' => array('filter' => 'Tinebase_Model_Filter_ForeignId', 
	        'options' => array(
	                'filtergroup'       => 'SCrm_Model_CriteriaCategoryFilter', 
	                'controller'        => 'SCrm_Controller_CriteriaCategory'
	            )
        ),
        'scrm_multiple_criteria_id' => array('filter' => 'Tinebase_Model_Filter_ForeignId', 
	        'options' => array(
	                'filtergroup'       => 'SCrm_Model_MultipleCriteriaFilter', 
	                'controller'        => 'SCrm_Controller_MultipleCriteria'
	            )
        )
        );
}