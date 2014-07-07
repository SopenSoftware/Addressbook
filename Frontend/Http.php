<?php
/**
 * Tine 2.0
 *
 * @package     Addressbook
 * @subpackage  Frontend
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Lars Kneschke <l.kneschke@metaways.de>
 * @copyright   Copyright (c) 2007-2009 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id: Http.php 13410 2010-03-16 08:37:49Z c.weiss@metaways.de $
 */

/**
 * Addressbook http frontend class
 *
 * This class handles all Http requests for the addressbook application
 *
 * @package     Addressbook
 * @subpackage  Frontend
 */
class Addressbook_Frontend_Http extends Tinebase_Frontend_Http_Abstract
{
    /**
     * app name
     *
     * @var string
     */
    protected $_applicationName = 'Addressbook';
    
    /**
     * export contact
     * 
     * @param string $_filter JSON encoded string with contact ids for multi export or contact filter
     * @param string $_format pdf or csv or ...
     */
    public function exportContacts($_filter, $_format = 'pdf')
    {
        $decodedFilter = Zend_Json::decode($_filter);
        if (! is_array($decodedFilter)) {
            $decodedFilter = array(array('field' => 'id', 'operator' => 'equals', 'value' => $decodedFilter));
        }
        
        $filter = new Addressbook_Model_ContactFilter($decodedFilter);
        
        parent::_export($filter, $_format, Addressbook_Controller_Contact::getInstance());
    }
    
 	public function printMultiLetter(){
    	error_reporting(E_ALL);
    	ini_set('display_errors','on');
    	set_time_limit(0);
    	ini_set('memory_limit','512M');
    	Addressbook_Controller_Print::getInstance()->printMultiLetter($_REQUEST['filters'], $_REQUEST['templateId'], $_REQUEST['preview']);
    }
    
	public function printEditableLetter(){
    	error_reporting(E_ALL);
    	ini_set('display_errors','on');
    	set_time_limit(0);
    	Addressbook_Controller_Print::getInstance()->printEditableLetter($_REQUEST['filters'], $_REQUEST['templateId'], $_REQUEST['data']);
    }
    
    /**
     * Returns all JS files which must be included for Addressbook
     * 
     * @return array array of filenames
     */
    public function getJsFilesToInclude ()
    {
        return array(
            'Addressbook/js/Model.js',
         	'Addressbook/js/Custom.js',
            'Addressbook/js/Addressbook.js',
         	'Addressbook/js/Renderer.js',
            'Addressbook/js/ContactGridDetailsPanel.js',
        	'Addressbook/js/ContactGrid.js',
        	'Addressbook/js/ContactSelectionGrid.js',
            'Addressbook/js/SoAddressbookExt.js',
            'Addressbook/js/FormListeners.js',
            'Addressbook/js/ContactEditDialog.js',
        	//'Addressbook/js/CustomContactEditDialog.js',
        	'Addressbook/js/ContactWidget.js',
            'Addressbook/js/SearchCombo.js',
			'Addressbook/js/ContactSelect.js',
        	'Addressbook/js/ContactContactEditDialog.js',
        	'Addressbook/js/ContactQuickEditDialog.js',
        	'Addressbook/js/RelationDescriptorSelect.js',
        	'Addressbook/js/ContactContactTreePanel.js',
        	'Addressbook/js/PrintContactDialog.js',
        	'Addressbook/js/PostalAddressHelper.js',
        	'Addressbook/js/DuplicateCheckWidget.js',
        	'Addressbook/js/ContactPersonEditDialog.js',
        	'Addressbook/js/ContactPersonGridPanel.js',
        	'Addressbook/js/SCrmPanel.js'
        	
        );
    }
}
