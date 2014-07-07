<?php
/**
 * sopen
 * 
 * @package     Addressbook
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Hans-Jürgen Hartl<hhart@sopen.de>
 * @copyright   Copyright (c) 2011 Hans-Jürgen Hartl
 * @version     $Id: $
 * 
 *

/**
 * csv import class for the addressbook
 * 
 * @package     Addressbook
 * @subpackage  Import
 * 
 */
class Addressbook_Import_PostalCodeCsv extends Tinebase_Import_Csv_Abstract
{    
    /**
     * the constructor
     *
     * @param Tinebase_Model_ImportExportDefinition $_definition
     * @param mixed $_controller
     * @param array $_options additional options
     */
    public function __construct(Tinebase_Model_ImportExportDefinition $_definition, $_controller = NULL, $_options = array())
    {
        parent::__construct($_definition, $_controller, $_options);

    }
    
    /**
     * add some more values (container id)
     *
     * @return array
     */
    protected function _addData($recordData)
    {
        $result = array();
        return $result;
    }
    
    /**
     * do conversions
     * -> sanitize account_id
     *
     * @param array $_data
     * @return array
     */
    protected function _doConversions($_data)
    {
        $result = parent::_doConversions($_data);
        return $result;
    }    
}