<?php

class Addressbook_Model_SoMemberFilter extends Tinebase_Model_Filter_DependentId
{
   
    public function appendFilterSql($_select, $_backend){
    	
    	if($this->_value){
    		 $af = array('field' => 'scrm_multiple_criteria_id',   'operator' => 'AND', 'value' => array(array(
    		 	'field' => 'id',
    		 	'operator' => 'in',
    		 	'value' => $this->_value
    		 )));
    		// print_r($af);
	    	$crmFilter = new Addressbook_Model_ContactMultipleCriteriaFilter(array(
	           $af
	        ));
	       
	        //print_r($crmFilter);
	        
	        $contactIds = Addressbook_Controller_ContactMultipleCriteria::getInstance()->searchContactIds($crmFilter, NULL);
	       // var_dump($contactIds);
	        
	        $filter = new Addressbook_Model_ContactFilter(array(),'AND');
	        if($this->_operator == 'in'){
	        	$filter->addFilter(new Tinebase_Model_Filter_Id('id', 'in', array_unique($contactIds)));
	        }elseif($this->_operator == 'notin'){
	        	$filter->addFilter(new Tinebase_Model_Filter_Id('id', 'notin', array_unique($contactIds)));
	        }
	       	Tinebase_Backend_Sql_Filter_FilterGroup::appendFilters($_select, $filter, $_backend);
    	}
    }
}
?>