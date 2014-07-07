<?php
/**
 * Tine 2.0
 * 
 * @package     Addressbook
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @copyright   Copyright (c) 2007-2008 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id: ContactFilter.php 14404 2010-05-18 15:58:41Z g.ciyiltepe@metaways.de $
 */

/**
 * Addressbook_Model_ContactFilter
 * 
 * @package     Addressbook
 * @subpackage  Filter
 */
class Addressbook_Model_ContactFilter extends Tinebase_Model_Filter_FilterGroup
{
    /**
     * @var string class name of this filter group
     *      this is needed to overcome the static late binding
     *      limitation in php < 5.3
     */
    protected $_className = 'Addressbook_Model_ContactFilter';
    
    /**
     * @var string application of this filter group
     */
    protected $_applicationName = 'Addressbook';
    
    /**
     * @var string name of model this filter group is designed for
     */
    protected $_modelName = 'Addressbook_Model_Contact';
    
    /**
     * @var array filter model fieldName => definition
     */
    protected $_filterModel = array(
        'id'                   => array('filter' => 'Tinebase_Model_Filter_Id'),
        'query'                => array(
            'filter' => 'Tinebase_Model_Filter_Query', 
            'options' => array('fields' => array(
            	'id','n_family', 'n_given', 'org_name', 'company2', 'company3', 'email', 'adr_one_locality', 'adr_two_locality', 'adr3_location',
    			'adr_one_street', 'adr_two_street', 'adr3_street','partner_forename', 'partner_lastname')
    		)
        ),
        'telephone'            => array(
            'filter' => 'Tinebase_Model_Filter_Query', 
            'options' => array('fields' => array(
                'tel_assistent',
                'tel_car',
                'tel_cell',
                'tel_cell_private',
                'tel_fax',
                'tel_fax_home',
                'tel_home',
                'tel_other',
                'tel_pager',
                'tel_prefer',
                'tel_work'
            ))
        ),
        'email_query'          => array(
            'filter' => 'Tinebase_Model_Filter_Query', 
            'options' => array('fields' => array(
                'email',
                'email_home',
            ))
        ),
        'contact_type'              => array('filter' => 'Tinebase_Model_Filter_Text'),
        'n_given'              => array('filter' => 'Tinebase_Model_Filter_Text'),
        'n_family'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'n_fileas'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'org_name'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'company2'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'company3'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'title'                => array('filter' => 'Tinebase_Model_Filter_Text'),
        'adr_one_street'       => array('filter' => 'Tinebase_Model_Filter_Text'),
        'adr_one_postalcode'   => array('filter' => 'Tinebase_Model_Filter_Text'),
        'adr_one_use_postbox'   => array('filter' => 'Tinebase_Model_Filter_Bool'),
        'adr_one_locality'     => array('filter' => 'Tinebase_Model_Filter_Text'),
        'adr_one_countryname'     => array('filter' => 'Tinebase_Model_Filter_Text'),
        'adr_two_street'       => array('filter' => 'Tinebase_Model_Filter_Text'),
        'adr_two_postalcode'   => array('filter' => 'Tinebase_Model_Filter_Text'),
        'adr_two_locality'     => array('filter' => 'Tinebase_Model_Filter_Text'),
        'email'                => array('filter' => 'Tinebase_Model_Filter_Text'),
        'email_home'           => array('filter' => 'Tinebase_Model_Filter_Text'),
        'tel_assistent'        => array('filter' => 'Tinebase_Model_Filter_Text'),
        'tel_car'              => array('filter' => 'Tinebase_Model_Filter_Text'),
        'tel_cell'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'tel_cell_private'     => array('filter' => 'Tinebase_Model_Filter_Text'),
        'tel_fax'              => array('filter' => 'Tinebase_Model_Filter_Text'),
        'tel_fax_home'         => array('filter' => 'Tinebase_Model_Filter_Text'),
        'tel_home'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'tel_pager'            => array('filter' => 'Tinebase_Model_Filter_Text'),
        'tel_work'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'note'                 => array('filter' => 'Tinebase_Model_Filter_Text'),
        'role'                 => array('filter' => 'Tinebase_Model_Filter_Text'),
        'tag'                  => array('filter' => 'Tinebase_Model_Filter_Tag', 'options' => array('idProperty' => 'addressbook.id')),
        'bday'               => array('filter' => 'Tinebase_Model_Filter_Date'),
        'last_modified_time'   => array('filter' => 'Tinebase_Model_Filter_Date'),
        'deleted_time'         => array('filter' => 'Tinebase_Model_Filter_DateTime'),
        'creation_time'        => array('filter' => 'Tinebase_Model_Filter_Date'),
        'last_modified_by'     => array('filter' => 'Tinebase_Model_Filter_User'),
        'created_by'           => array('filter' => 'Tinebase_Model_Filter_User'),
        'container_id'         => array('filter' => 'Tinebase_Model_Filter_Container', 'options' => array('applicationName' => 'Addressbook')),
        'type'                 => array('custom' => true),
        'user_status'          => array('custom' => true),
        'customfield'          => array('filter' => 'Tinebase_Model_Filter_CustomField', 'options' => array('idProperty' => 'addressbook.id')),
        'main_category_contact_id' => array('filter' => 'Tinebase_Model_Filter_Text' ),
        'bank_account_number'              => array('filter' => 'Tinebase_Model_Filter_Text'),
        'is_locked'              => array('filter' => 'Tinebase_Model_Filter_Text'),
        'debitor_ext_id'              => array('filter' => 'Tinebase_Model_Filter_Text'),
        
        
        'sex'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'partner_forename'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'partner_lastname'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'partner_sex'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'partner_birth_day'             => array('filter' => 'Tinebase_Model_Filter_Date'),
        'contact_source'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'province'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'district'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'county'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'community'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'community_key'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'cultural_area'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'is_affiliator'             => array('filter' => 'Tinebase_Model_Filter_Bool'),
        'is_affiliated'             => array('filter' => 'Tinebase_Model_Filter_Bool'),
        'affiliate_contact_id' => array('filter' => 'Tinebase_Model_Filter_Int'),
        'affiliator_provision_date'             => array('filter' => 'Tinebase_Model_Filter_Date'),
        'affiliator_provision'   => array('filter' => 'Tinebase_Model_Filter_Int'),
        'count_magazines'             => array('filter' => 'Tinebase_Model_Filter_Int'),
        'count_additional_magazines'             => array('filter' => 'Tinebase_Model_Filter_Int'),
        
        'user_former_system'             => array('filter' => 'Tinebase_Model_Filter_Text'),
        'info_letter_date'             => array('filter' => 'Tinebase_Model_Filter_Date'),
        'contact_multiple_criteria_id'             => array('filter' => 'Addressbook_Model_SCrmCriteriaFilter'),
        // dependent filter on SoMembers
        //'member_id'             => array('filter' => 'Addressbook_Model_SoMemberFilter')
        'member_id' => array('filter' => 'Tinebase_Model_Filter_DependentId', 
            'options' => array(
                'filtergroup'       => 'Membership_Model_SoMemberFilter', 
                'controller'        => 'Membership_Controller_SoMember',
        		'fkey'				=> 'contact_id'
            )
        )
    );
    
 	public function __construct(array $_data = array(), $_condition='', $_options = array())
    {
        $defs = Addressbook_Controller_ContactMultipleCriteria::getInstance()->getAllCategoryDefinitions();
        foreach($defs as $def){
        	$this->_filterModel['contact_multiple_criteria_id_'.$def['key']] = array('filter' => 'Addressbook_Model_SCrmCriteriaFilter');
        }
    	parent::__construct($_data, $_condition, $_options);
    }
    
    /**
     * appends custom filters to a given select object
     *
     * @param  Zend_Db_Select                       $_select
     * @param  Felamimail_Backend_Cache_Sql_Message $_backend
     * @return void
     *
     * @todo use group of Tinebase_Model_Filter_Text with OR?
     * @todo user_status: allow array as value and use 'in' operator
     */
    public function appendFilterSql($_select, $_backend)
    {
        $db = $_backend->getAdapter();
        
        foreach ($this->_customData as $customData) {
            switch($customData['field']) {
                case 'type':
                    $_select->where(
                        $db->quoteInto("IF(ISNULL(account_id),'contact', 'user') = ?", $customData['value'])
                    );
                    break;
                case 'user_status':
                    $status = explode(' ', $customData['value']);
                    $_select->where(
                        $db->quoteInto("IF(`status` = 'enabled' AND NOW() > `expires_at`, 'expired', status) IN (?)", $status)
                    );
                    break;
            }
        }
        
    }
}
