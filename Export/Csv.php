<?php
/**
 * Addressbook csv generation class
 *
 * @package     Addressbook
 * @subpackage	Export
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schuele <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2007-2008 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id: Csv.php 14552 2010-05-28 12:47:27Z f.wiechmann@metaways.de $
 * 
 */

/**
 * Addressbook csv generation class
 * 
 * @package     Addressbook
 * @subpackage	Export
 * 
 */
class Addressbook_Export_Csv extends Tinebase_Export_Csv
{
	
	/**
     * special fields
     * 
     * @var array
     */
    protected $_specialFields = array(
	    'adr_one_label' => 1,
	    'adr_two_label'=> 2,
	    'adr3_label' => 3,
	    'adr4_label' => 4
    );
    
    
    /**
     * export timesheets to csv file
     *
     * @param Addressbook_Model_ContactFilter $_filter
     * @return string filename
     */
    public function generate($_filter, $_toStdout = FALSE) {
        
        $pagination = new Tinebase_Model_Pagination(array(
            'start' => 0,
            'limit' => 0,
            'sort' => 'n_fileas',
            'dir' => 'ASC',
        ));
        
        //if (Tinebase_Core::isLogLevel(Zend_Log::DEBUG)) Tinebase_Core::getLogger()->debug(__METHOD__ . '::' . __LINE__ . ' ' . print_r($_filter->toArray(), true));
        
        $contacts = Addressbook_Controller_Contact::getInstance()->search($_filter, $pagination, FALSE, FALSE, 'export');
        if (count($contacts) < 1) {
            throw new Addressbook_Exception_NotFound('No Contacts found.');
        }

        $skipFields = array(
            'created_by'            ,
            'creation_time'         ,
            'last_modified_by'      ,
            'last_modified_time'    ,
            'is_deleted'            ,
            'deleted_time'          ,
            'deleted_by'            ,
            'jpegphoto'
        );
        
        $filename = parent::exportRecords($contacts, $_toStdout, $skipFields);
        return $filename;
    }
    
 /**
     * special field value function
     * 
     * @param Tinebase_Record_Abstract $_record
     * @param string $_fieldName
     * @return string
     */
    protected function _addSpecialValue(Tinebase_Record_Abstract $_record, $_fieldName)
    {
    	
    	if(trim($str) != ''){
    		return $str;
    	}else{
    		if(array_key_exists($_fieldName, $this->_specialFields)){
	    		$drawee = $_record->getDraweeByAddressNumber($this->_specialFields[$_fieldName]);
	        	return $drawee->setLineBreak(chr(13).chr(10))->toText();
    		}
    	}
    	return '';
    }
}
