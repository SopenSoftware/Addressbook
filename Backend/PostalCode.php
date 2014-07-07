<?php
class Addressbook_Backend_PostalCode extends Tinebase_Backend_Sql_Abstract
{
    /**
     * Table name without prefix
     *
     * @var string
     */
    protected $_tableName = 'addressbook_postal_code';
    
    /**
     * Model name
     *
     * @var string
     */
    protected $_modelName = 'Addressbook_Model_PostalCode';
    
    public function getByPostalCode($postalCode, $countryCode){
    	return $this->getByPropertySet(
    		array(
    			'postal_code' => (string) $postalCode,
    			'country_code' => $countryCode
    		),
    		false, 	// 	deleted: not part of table
    		false	//	get result set (multiple results allowed)
    	)->toArray();
    }
    
    public function getByLocation($location, $countryCode){
    	return $this->getByPropertySet(
    		array(
    			'place_name' => $location,
    			'country_code' => $countryCode
    		),
    		false, 	// 	deleted: not part of table
    		false	//	get result set (multiple results allowed)
    	)->toArray();
    }
}