<?php
/**
 * Tine 2.0
 *
 * @package     Addressbook
 * @subpackage  Setup
 * @license     http://www.gnu.org/licenses/agpl.html AGPL3
 * @copyright   Copyright (c) 2010 Metaways Infosystems GmbH (http://www.metaways.de)
 * @author      Philipp Schuele <p.schuele@metaways.de>
 * @version     $Id: Release3.php 14255 2010-05-07 13:36:52Z c.weiss@metaways.de $
 */

class Addressbook_Setup_Update_Release3 extends Setup_Update_Abstract
{
    /**
     * update from 3.0 -> 3.1
     * - add new import definition
     * 
     * @return void
     */
    public function update_0()
    {
        // get import export definitions and save them in db
        Setup_Controller::getInstance()->createImportExportDefinitions(Tinebase_Application::getInstance()->getApplicationByName('Addressbook'));
        
        $this->setApplicationVersion('Addressbook', '3.1');
    }
    
    /**
     * create default persistent filters
     */
    public function update_1()
    {
        $pfe = new Tinebase_PersistentFilter_Backend_Sql();
        
        $myEventsPFilter = $pfe->create(new Tinebase_Model_PersistentFilter(array(
            'name'              => Addressbook_Preference::DEFAULTPERSISTENTFILTER_NAME,
            'description'       => "All contacts I have read grants for", // _("All contacts I have read grants for")
            'account_id'        => NULL,
            'application_id'    => Tinebase_Application::getInstance()->getApplicationByName('Addressbook')->getId(),
            'model'             => 'Addressbook_Model_ContactFilter',
            'filters'           => array(),
        )));
        
        $tableDefinition = '
        <table>
		    <name>addressbook_relation_descriptor</name>
            <version>1</version>
            <declaration>
                <field>
                    <name>id</name>
                    <type>integer</type>
                    <autoincrement>true</autoincrement>
                </field>
                <field>
                    <name>key</name>
                    <type>text</type>
                    <length>48</length>
					<unique>true</unique>
                    <notnull>true</notnull>
                </field>				
				<field>
                    <name>name</name>
                    <type>text</type>
                    <length>64</length>
                    <notnull>true</notnull>
                </field>
				<field>
                    <name>description</name>
                    <type>text</type>
                    <length>255</length>
                </field>	
				<field>
                    <name>degree</name>
                    <type>enum</type>
					<value>parent</value>
                    <value>sibling</value>
					<value>child</value>
                </field>							
				<index>
					<name>relation_descriptor_pkey</name>
					<primary>true</primary>
					<field>
						<name>id</name>
					</field>
				</index>
			</declaration>
		</table>
        ';
        $table = Setup_Backend_Schema_Table_Factory::factory('String', $tableDefinition);
        $this->_backend->createTable($table);
        Tinebase_Application::getInstance()->addApplicationTable(
            Tinebase_Application::getInstance()->getApplicationByName('Addressbook'), 
            'addressbook_relation_descriptor', 
            1
        );
        $tableDefinition = '
        <table>
		    <name>addressbook_addressbook</name>
            <version>1</version>
            <declaration>
                <field>
                    <name>id</name>
                    <type>integer</type>
                    <autoincrement>true</autoincrement>
                </field>            	
                <field>
                    <name>from_contact_id</name>
                    <type>integer</type>
                    <notnull>true</notnull>
                </field>
				<field>
                    <name>to_contact_id</name>
                    <type>integer</type>
                    <notnull>true</notnull>
                </field>
				<field>
                    <name>relation_descriptor_id</name>
                    <type>integer</type>
                    <notnull>true</notnull>
                </field>
				<field>
                    <name>start_time</name>
                    <type>datetime</type>
                </field>
                <field>
                    <name>end_time</name>
                    <type>datetime</type>
                </field>				
				<field>
                    <name>created_by</name>
                    <type>text</type>
                    <length>40</length>
                </field>
                <field>
                    <name>creation_time</name>
                    <type>datetime</type>
                </field> 
                <field>
                    <name>last_modified_by</name>
                    <type>text</type>
                    <length>40</length>
                </field>
                <field>
                    <name>last_modified_time</name>
                    <type>datetime</type>
                </field>
                <field>
                    <name>is_deleted</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>
                <field>
                    <name>deleted_by</name>
                    <type>text</type>
                    <length>40</length>
                </field>            
                <field>
                    <name>deleted_time</name>
                    <type>datetime</type>
                </field>
				<index>
					<name>id</name>
					<primary>true</primary>
					<unique>true</unique>
					<field>
						<name>id</name>
					</field>
				</index>
				<index>
                    <name>from_contact_fkey</name>
                    <field>
                        <name>from_contact_id</name>
                    </field>
                    <foreign>true</foreign>
                    <reference>
                        <table>addressbook</table>
                        <field>id</field>
                    </reference>
                </index>	
				<index>
                    <name>to_contact_fkey</name>
                    <field>
                        <name>to_contact_id</name>
                    </field>
                    <foreign>true</foreign>
                    <reference>
                        <table>addressbook</table>
                        <field>id</field>
                    </reference>
                </index>							
				<index>
                    <name>relation_descriptor_fkey</name>
                    <field>
                        <name>relation_descriptor_id</name>
                    </field>
                    <foreign>true</foreign>
                    <reference>
                        <table>addressbook_relation_descriptor</table>
                        <field>id</field>
                    </reference>
                </index>					
            </declaration>				
		</table>
        ';
        $table = Setup_Backend_Schema_Table_Factory::factory('String', $tableDefinition);
        $this->_backend->createTable($table);
        Tinebase_Application::getInstance()->addApplicationTable(
            Tinebase_Application::getInstance()->getApplicationByName('Addressbook'), 
            'addressbook_addressbook', 
            1
        );
        $this->setApplicationVersion('Addressbook', '3.2');
        
    }
    
    public function update_2(){
    	// remove uneeded tables
        if($this->_backend->tableExists('so_addressbook_addressbook_lnk')){
 			$this->_backend->dropForeignKey('so_addressbook_addressbook_lnk', 'so_addressbook_parent_id-addressbook::id');
        	$this->_backend->dropForeignKey('so_addressbook_addressbook_lnk', 'so_addressbook_child_id-addressbook::id');
        	$this->dropTable('so_addressbook_addressbook_lnk');
        }
        Tinebase_Application::getInstance()->removeApplicationTable(
            Tinebase_Application::getInstance()->getApplicationByName('Addressbook')->getId(), 
            'so_addressbook_addressbook_lnk'
        );
     	
    	$this->setApplicationVersion('Addressbook', '3.3');
    }
    
    public function update_3()
    {
    	$declaration = new Setup_Backend_Schema_Field_Xml('
            <field>
	                <name>contact_type</name>
	                <type>enum</type>
					<value>person</value>
					<value>family</value>
					<value>orga</value>
	                <default>person</default>
	            </field>');
        $this->_backend->addCol('addressbook', $declaration);
    	
        $declaration = new Setup_Backend_Schema_Field_Xml('
            <field>
	                <name>orga_type_id</name>
					<type>integer</type>
	                <notnull>false</notnull>
					<default>0</default>
	            </field>');
        $this->_backend->addCol('addressbook', $declaration);
                    	
    	$declaration = new Setup_Backend_Schema_Field_Xml('
            <field>
                <name>invoice_receiver</name>
                <type>text</type>
                <length>128</length>
            </field>');
        $this->_backend->addCol('addressbook', $declaration);

        $declaration = new Setup_Backend_Schema_Field_Xml('
            <field>
                <name>shipping_receiver</name>
                <type>text</type>
                <length>128</length>
            </field>');
        $this->_backend->addCol('addressbook', $declaration);
        
        $this->setApplicationVersion('Addressbook', '3.4');
    }
    
    public function update_4()
    {
    	$dropColumns = array(
			'so_donation_konto',
			'so_donation_amount',
			'so_donation_balance',
			'so_regdonation_payment_interval_id',
			'so_regdon_payment_method_id',
			'so_regdon_lifetime_value',
			'so_regdon_firstco_datetime',
			'so_regdon_campaign_id',
			'so_regdon_affiliate_id',
			'so_regdon_firstdo_datetime', 
			'so_regdon_fido_campaign_id',
			'so_regdon_fido_affiliate_id',
			'so_don_affinity_seasonal',
			'so_don_affinity_seasonal_id',
			'so_don_affinity_regional',
			'so_don_affinity_regional_id',
			'so_don_affinity_themes',
			'so_don_affinity_themes_id',
			'so_don_affinity_events',
			'so_don_affinity_events_id',
			'so_hrdev_actual_position',
			'so_hrdev_costs_act_year',
			'so_hrdev_costs_total',
			'so_hrdev_edu_id',
			'so_hrdev_desired_position',
			'so_hrdev_planned_costs',
			'so_hrdev_next_appraisal_datetime',
			'so_hrdev_appraisal_partner_hr',
			'so_hrdev_appraisal_partner_lm',
			'so_hrdev_discharge_datetime',
			'so_hrdev_termination_datetime',
			'so_hrdev_termination_reason_id',
			'so_hrdev_targets_eco',
			'so_hrdev_targets_eco_id',
			'so_hrdev_targets_tec',
			'so_hrdev_targets_tec_id',
			'so_hrdev_targets_soft',
			'so_hrdev_targets_soft_id',
			'so_hrdev_targets_lang',
			'so_hrdev_targets_lang_id'
		);
    	$this->dropColumns('addressbook',$dropColumns);
    	$this->setApplicationVersion('Addressbook', '3.5');
    }
    
    public function update_5(){
    	$declaration = new Setup_Backend_Schema_Field_Xml('
           <field>
		      <name>contact_source_id</name>
		      <type>integer</type>
		   </field>	');
        $this->_backend->addCol('addressbook', $declaration);
        $this->setApplicationVersion('Addressbook', '3.6');
    }

       public function update_6(){
    	$declaration = new Setup_Backend_Schema_Field_Xml('
        	<field>
				<name>form_of_address</name>
				<type>text</type>
				<length>128</length>
			</field>');
        $this->_backend->addCol('addressbook', $declaration);
        $this->setApplicationVersion('Addressbook', '3.7');
    }
    
    public function update_7(){
    	$declaration = new Setup_Backend_Schema_Field_Xml('
        	<field>
	            <name>adr_one_co</name>
	            <type>text</type>
	            <length>128</length>
	        </field>');
        $this->_backend->addCol('addressbook', $declaration);
        
        $declaration = new Setup_Backend_Schema_Field_Xml('
        	<field>
	            <name>adr_two_co</name>
	            <type>text</type>
	            <length>128</length>
	        </field>');
        $this->_backend->addCol('addressbook', $declaration);
        
        $declaration = new Setup_Backend_Schema_Field_Xml('
        	<field>
	            <name>adr3_co</name>
	            <type>text</type>
	            <length>128</length>
	        </field>');
        
        $this->_backend->addCol('addressbook', $declaration);
        
        $this->setApplicationVersion('Addressbook', '3.8');
    }
    
    public function update_8(){
    	$declaration = new Setup_Backend_Schema_Field_Xml('
        	 <field>
                    <name>is_manual_form</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>');
        $this->_backend->addCol('addressbook', $declaration);
        
        $declaration = new Setup_Backend_Schema_Field_Xml('
        	<field>
                    <name>is_manual_salutation</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>');
        $this->_backend->addCol('addressbook', $declaration);
        
        $this->setApplicationVersion('Addressbook', '3.9');
    }
    
    public function update_9(){
    	$dec = new Setup_Backend_Schema_Table_Xml('
    	<table>
		    <name>addressbook_postal_code</name>
            <version>1</version>
            <declaration>
                <field>
                    <name>id</name>
                    <type>integer</type>
                    <autoincrement>true</autoincrement>
                </field>
                <field>
                    <name>country_code</name>
                    <type>text</type>
                    <length>2</length>
					<notnull>true</notnull>
                </field>				
				<field>
                    <name>postal_code</name>
                    <type>text</type>
                    <length>20</length>
					<notnull>true</notnull>
                </field>				
				<field>
                    <name>place_name</name>
                    <type>text</type>
                    <length>180</length>
					<notnull>true</notnull>
                </field>				
				<field>
                    <name>admin_name1</name>
                    <type>text</type>
                    <length>100</length>
					<notnull>false</notnull>
                </field>				
				<field>
                    <name>admin_code1</name>
                    <type>text</type>
                    <length>20</length>
					<notnull>false</notnull>
                </field>				
				<field>
                    <name>admin_name2</name>
                    <type>text</type>
                    <length>100</length>
					<notnull>false</notnull>
                </field>				
				<field>
                    <name>admin_code2</name>
                    <type>text</type>
                    <length>20</length>
					<notnull>false</notnull>
                </field>				
				<field>
                    <name>admin_name3</name>
                    <type>text</type>
                    <length>100</length>
					<notnull>false</notnull>
                </field>				
				<field>
                    <name>admin_code3</name>
                    <type>text</type>
                    <length>20</length>
					<notnull>false</notnull>
                </field>				
				<field>
                    <name>lat</name>
                    <type>float</type>
                    <notnull>false</notnull>
                </field>				
				<field>
                    <name>lon</name>
                    <type>float</type>
                    <notnull>false</notnull>
                </field>	
				<field>
                    <name>acc</name>
                    <type>integer</type>
                    <notnull>false</notnull>
					<default>1</default>
                </field>				
				<index>
					<name>id</name>
					<primary>true</primary>
					<field>
						<name>id</name>
					</field>
				</index>
				<index>
					<name>country_code</name>
					<field>
						<name>country_code</name>
					</field>
				</index>
				<index>
					<name>postal_code</name>
					<field>
						<name>postal_code</name>
					</field>
				</index>
				<index>
					<name>place_name</name>
					<field>
						<name>place_name</name>
					</field>
				</index>
			</declaration>
		</table>
    	');
    	$this->_backend->createTable($dec);
        
    	
    	
        $this->setApplicationVersion('Addressbook', '3.91');
    }
    
	public function update_91(){
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
				<name>sex</name>
				<type>enum</type>
				<value>MALE</value>
				<value>FEMALE</value>
				<value>NEUTRAL</value>
				<default>NEUTRAL</default>
			</field>
		');
		$this->_backend->addCol('addressbook', $dec);
		$this->setApplicationVersion('Addressbook', '3.92');
	}
	
	public function update_92(){
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>is_locked</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		$this->setApplicationVersion('Addressbook', '3.93');
	}
	
	public function update_93(){
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>lock_comment</name>
                    <type>text</type>
                    <length>512</length>
					<notnull>false</notnull>
					<default>null</default>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>lock_date</name>
                    <type>date</type>
					<notnull>false</notnull>
					<default>null</default>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		$this->setApplicationVersion('Addressbook', '3.931');
	}
	
	
	public function update_931(){
		/*$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
			      <name>adr4_addition</name>
			      <type>text</type>
			   </field>  
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
			   <name>adr4_street</name>
			   <type>text</type>
			 </field>   
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			 <field>
			   <name>adr4_postal_code</name>
			   <type>text</type>
			 </field> 
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			 <field>
			   <name>adr4_location</name>
			   <type>text</type>
			 </field>  
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			 <field>
			     <name>adr4_countryname</name>
			     <type>text</type>
			     <length>64</length>
			     <notnull>false</notnull>
			 </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			 <field>
		            <name>adr4_co</name>
		            <type>text</type>
		            <length>128</length>
		        </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>tel_fax3</name>
                    <type>text</type>
                    <length>40</length>
                    <notnull>false</notnull>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			 <field>
                    <name>tel_fax4</name>
                    <type>text</type>
                    <length>40</length>
                    <notnull>false</notnull>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>tel3</name>
                    <type>text</type>
                    <length>40</length>
                    <notnull>false</notnull>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);*/
		
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>tel4</name>
                    <type>text</type>
                    <length>40</length>
                    <notnull>false</notnull>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>tel_cell3</name>
                    <type>text</type>
                    <length>40</length>
                    <notnull>false</notnull>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>tel_cell4</name>
                    <type>text</type>
                    <length>40</length>
                    <notnull>false</notnull>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>email3</name>
                    <type>text</type>
                    <length>64</length>
                    <notnull>false</notnull>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>email4</name>
                    <type>text</type>
                    <length>64</length>
                    <notnull>false</notnull>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
			
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>url3</name>
                    <type>text</type>
                    <length>128</length>
                    <notnull>false</notnull>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
					<name>adr4_is_letter_address</name>
					<type>boolean</type>
					<default>false</default>
				</field>
		');
		$this->_backend->addCol('addressbook', $dec);
		$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
					<name>adr4_is_shipping_address</name>
					<type>boolean</type>
					<default>false</default>
				</field>
		');
		$this->_backend->addCol('addressbook', $dec);
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
					<name>adr4_is_invoice_address</name>
					<type>boolean</type>
					<default>false</default>
				</field>
		');
		$this->_backend->addCol('addressbook', $dec);
				
		
		$this->setApplicationVersion('Addressbook', '3.932');
	}            

	
	public function update_932(){
		/*
		$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>person_leading</name>
                    <type>boolean</type>
                    <default>true</default>
                </field> 
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>you_salutation</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>  
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
				   <name>nationality</name>
				   <type>text</type>
				   <length>36</length>
				</field> 
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
				   <name>official_title</name>
				   <type>text</type>
				   <length>48</length>
				</field>  
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>adr_one_use_postbox</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			 <field>
				   <name>adr_one_postbox</name>
				   <type>text</type>
				   <length>12</length>
				</field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
				   <name>adr_one_postbox_postal_code</name>
				   <type>text</type>
				   <length>12</length>
				</field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>adr_two_use_postbox</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
				   <name>adr_two_postbox</name>
				   <type>text</type>
				   <length>12</length>
				</field> 
		');
		$this->_backend->addCol('addressbook', $dec);
		
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
				   <name>adr_two_postbox_postal_code</name>
				   <type>text</type>
				   <length>12</length>
				</field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>adr3_use_postbox</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
				   <name>adr3_postbox</name>
				   <type>text</type>
				   <length>12</length>
				</field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
				   <name>adr3_postbox_postal_code</name>
				   <type>text</type>
				   <length>12</length>
				</field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>adr4_use_postbox</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
			
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
				   <name>adr4_postbox</name>
				   <type>text</type>
				   <length>12</length>
				</field>
		');
		$this->_backend->addCol('addressbook', $dec);
		*/
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
				   <name>adr4_postbox_postal_code</name>
				   <type>text</type>
				   <length>12</length>
				</field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$this->setApplicationVersion('Addressbook', '3.933');
	}      

	
 	public function update_933(){
    	$dec = new Setup_Backend_Schema_Table_Xml('
    	<table>
			<name>contact_person</name>
			<version>1</version>
			<engine>InnoDB</engine>
         	<charset>utf8</charset>
			<declaration>
				<field>
					<name>id</name>
					<type>integer</type>
					<autoincrement>true</autoincrement>
					<notnull>true</notnull>
				</field>
			 	<field>
                    <name>contact_id</name>
                    <type>integer</type>
                    <notnull>true</notnull>
				</field>
				<field>
					<name>name</name>
					<type>text</type>
					<length>128</length>	
				</field>
				<field>
					<name>unit</name>
					<type>text</type>
					<length>128</length>
				</field>
				<field>
					<name>role</name>
					<type>text</type>
					<length>128</length>	
				</field>
				<index>
	                <name>id</name>
					<primary>true</primary>
					<field>
						<name>id</name>
					</field>	            	
				</index>
				<index>
                    <name>contact_person::contact_id-contact_person::id</name>
                    <field>
                        <name>contact_id</name>
                    </field>
                    <foreign>true</foreign>
                    <reference>
                        <table>addressbook</table>
                        <field>id</field>
                        <ondelete>CASCADE</ondelete>
                    </reference>
                    <ondelete>CASCADE</ondelete>
                </index>
			</declaration>
		</table>	
    	');
    	$this->_backend->createTable($dec);
        
    	
    	
        $this->setApplicationVersion('Addressbook', '3.934');
    }
    
    public function update_934(){
    	
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>adr_one_label</name>
                    <type>text</type>
                    <length>512</length>
                    <notnull>false</notnull>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>adr_two_label</name>
                    <type>text</type>
                    <length>512</length>
                    <notnull>false</notnull>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>adr3_label</name>
                    <type>text</type>
                    <length>512</length>
                    <notnull>false</notnull>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>adr4_label</name>
                    <type>text</type>
                    <length>512</length>
                    <notnull>false</notnull>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$this->setApplicationVersion('Addressbook', '3.935');
	}
	
	public function update_935(){
		/*$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>id</name>
                    <type>integer</type>
                    <autoincrement>true</autoincrement>
                </field>
		');
		$this->_backend->alterCol('so_contact_title', $dec);
		*/
		// this steps fails: SQLSTATE[23000]: Integrity constraint violation: 1062 ALTER TABLE causes auto_increment resequencing, resulting in duplicate entry '1' for key 'PRIMARY'"
		// @todo
		$this->setApplicationVersion('Addressbook', '3.936');
	}    

	public function update_936(){
		
		$this->_backend->dropCol('contact_person','name');
		$this->_backend->dropCol('contact_person','unit');
		$this->_backend->dropCol('contact_person','role');
		
		$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
					<name>contact_person_id</name>
                    <type>integer</type>
                    <notnull>true</notnull>
				</field>
		');
		$this->_backend->addCol('contact_person', $dec);
		
		/*
		 * again:problem with index: @todo fix
		 * $dec = new Setup_Backend_Schema_Index_Xml('
				<index>
                    <name>cp::contact_person_id-contact::id</name>
                    <field>
                        <name>contact_person_id</name>
                    </field>
                    <foreign>true</foreign>
                    <reference>
                        <table>addressbook</table>
                        <field>id</field>
                        <ondelete>CASCADE</ondelete>
                    </reference>
                    <ondelete>CASCADE</ondelete>
                </index>
		');
		$this->_backend->addIndex('contact_person', $dec);
		*/
		
		$this->setApplicationVersion('Addressbook', '3.937');
	}  
	
	public function update_937(){
		
		
		$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>is_main_contact_person</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>
		');
		$this->_backend->addCol('contact_person', $dec);
		
		$this->setApplicationVersion('Addressbook', '3.938');
	}  
	
	/**
	 * 
	 * sync with customized versions
	 */
	public function update_938(){
		
		// dialogum extension: sync point 3.940
		// 2013-02-06: HH
		
		$this->setApplicationVersion('Addressbook', '3.940');
	}  
	
	
	public function update_940(){
		
		$dec = new Setup_Backend_Schema_Table_Xml('
    	<table>
			<name>contact_multiple_criteria</name>
			<version>1</version>
			<engine>InnoDB</engine>
         	<charset>utf8</charset>
			<declaration>
				<field>
					<name>id</name>
					<type>integer</type>
					<autoincrement>true</autoincrement>
					<notnull>true</notnull>
				</field>
				<field>
                    <name>contact_id</name>
                    <type>integer</type>
                    <notnull>true</notnull>
				</field>
				<field>
                    <name>scrm_multiple_criteria_id</name>
                    <type>integer</type>
                    <notnull>true</notnull>
				</field>
				<field>
                    <name>scrm_criteria_category_id</name>
                    <type>integer</type>
                    <notnull>true</notnull>
				</field>
				<field>
                    <name>has_criteria</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>
				<field>
                    <name>percentage</name>
                    <type>integer</type>
                    <default>0</default>
                </field>
				<index>
	                <name>id</name>
					<primary>true</primary>
					<field>
						<name>id</name>
					</field>	            	
				</index>
				<index>
                    <name>contact_mc::contact_id-contact_mc::id</name>
                    <field>
                        <name>contact_id</name>
                    </field>
                    <foreign>true</foreign>
                    <reference>
                        <table>addressbook</table>
                        <field>id</field>
                        <ondelete>CASCADE</ondelete>
                    </reference>
                    <ondelete>CASCADE</ondelete>
                </index>
				<index>
                    <name>cmc::multiple_criteria_id-mc::id</name>
                    <field>
                        <name>scrm_multiple_criteria_id</name>
                    </field>
                    <foreign>true</foreign>
                    <reference>
                        <table>scrm_multiple_criteria</table>
                        <field>id</field>
                        <ondelete>CASCADE</ondelete>
                    </reference>
                    <ondelete>CASCADE</ondelete>
                </index>
			</declaration>
		</table>
    	');
    	$this->_backend->createTable($dec);
		
		$this->setApplicationVersion('Addressbook', '3.941');
	}  
	
	public function update_941(){
		// sync version with dialogum extension
		$this->setApplicationVersion('Addressbook', '3.942');
	}  
	
	public function update_942(){
		
		$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>bday</name>
                    <type>date</type>
                    <notnull>false</notnull>
                </field>
		');
		$this->_backend->alterCol('addressbook', $dec);
		
		// sync version with dialogum extension
		$this->setApplicationVersion('Addressbook', '3.943');
	}  
        
	public function update_943(){
		
		$dec = new Setup_Backend_Schema_Field_Xml('
                    <field>
                        <name>manager_kind</name>
                        <type>text</type>
                        <length>255</length>
                        <notnull>false</notnull>
                    </field>
		');
                
		$this->_backend->addCol('manager_kind', $dec);
		
		// sync version with dialogum extension
		$this->setApplicationVersion('Addressbook', '3.944');
	}  
	
	public function update_943(){
		
		$this->_backend->dropCol('addressbook','drinks_meeting_id');
		$this->_backend->dropCol('addressbook','drinks_alcohol_id');
		$this->_backend->dropCol('addressbook','eating_id');
		$this->_backend->dropCol('addressbook','culture_art_id');
		$this->_backend->dropCol('addressbook','tec_interest_id');
		$this->_backend->dropCol('addressbook','politics_id');
		$this->_backend->dropCol('addressbook','family_id');
		$this->_backend->dropCol('addressbook','hobbies_id');
		$this->_backend->dropCol('addressbook','social_networks_id');
		$this->_backend->dropCol('addressbook','campaigns_id');
		
		$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>is_affiliated</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		
		$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>affiliate_contact_id</name>
                    <type>integer</type>
					<notnull>false</notnull>
					<default>null</default>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>affiliator_provision</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>true</notnull>
					<default>0</default>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>affiliator_provision_date</name>
                    <type>date</type>
					<notnull>false</notnull>
					<default>null</default>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
	
		$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>is_affiliator</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>count_magazines</name>
                    <type>integer</type>
					<notnull>true</notnull>
					<default>0</default>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>count_additional_magazines</name>
                    <type>integer</type>
					<notnull>true</notnull>
					<default>0</default>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$this->setApplicationVersion('Addressbook', '3.944');
	}
	
	public function update_944(){
		
		$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>user_former_system</name>
                    <type>text</type>
					<length>64</length>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>is_imported</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$this->setApplicationVersion('Addressbook', '3.945');
		
	}
	
	public function update_945(){
		
		
		$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>info_letter_date</name>
                    <type>date</type>
                    <notnull>false</notnull>
                    <default>null</default>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$this->setApplicationVersion('Addressbook', '3.946');
		
	}
	
	public function update_946(){
		// setup order problem
		// table did not exist in all installations
		// tentatively install (if not exists) and set up version number for all!
		if(!$this->_backend->tableExists('contact_multiple_criteria')){
			$dec = new Setup_Backend_Schema_Table_Xml('
	    	<table>
				<name>contact_multiple_criteria</name>
				<version>1</version>
				<engine>InnoDB</engine>
	         	<charset>utf8</charset>
				<declaration>
					<field>
						<name>id</name>
						<type>integer</type>
						<autoincrement>true</autoincrement>
						<notnull>true</notnull>
					</field>
					<field>
	                    <name>contact_id</name>
	                    <type>integer</type>
	                    <notnull>true</notnull>
					</field>
					<field>
	                    <name>scrm_multiple_criteria_id</name>
	                    <type>integer</type>
	                    <notnull>true</notnull>
					</field>
					<field>
	                    <name>scrm_criteria_category_id</name>
	                    <type>integer</type>
	                    <notnull>true</notnull>
					</field>
					<field>
	                    <name>has_criteria</name>
	                    <type>boolean</type>
	                    <default>false</default>
	                </field>
					<field>
	                    <name>percentage</name>
	                    <type>integer</type>
	                    <default>0</default>
	                </field>
					<index>
		                <name>id</name>
						<primary>true</primary>
						<field>
							<name>id</name>
						</field>	            	
					</index>
					<index>
	                    <name>contact_mc::contact_id-contact_mc::id</name>
	                    <field>
	                        <name>contact_id</name>
	                    </field>
	                    <foreign>true</foreign>
	                    <reference>
	                        <table>addressbook</table>
	                        <field>id</field>
	                        <ondelete>CASCADE</ondelete>
	                    </reference>
	                    <ondelete>CASCADE</ondelete>
	                </index>
					<index>
	                    <name>cmc::multiple_criteria_id-mc::id</name>
	                    <field>
	                        <name>scrm_multiple_criteria_id</name>
	                    </field>
	                    <foreign>true</foreign>
	                    <reference>
	                        <table>scrm_multiple_criteria</table>
	                        <field>id</field>
	                        <ondelete>CASCADE</ondelete>
	                    </reference>
	                    <ondelete>CASCADE</ondelete>
	                </index>
				</declaration>
			</table>
	    	');
	    	$this->_backend->createTable($dec);
		}
		$this->setApplicationVersion('Addressbook', '3.947');
	}  
	
	/*public function update_947(){
		
		
		$dec = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>company3</name>
                    <type>text</type>
                    <length>256</length>
                    <notnull>false</notnull>
                </field>
		');
		$this->_backend->addCol('addressbook', $dec);
		
		$this->setApplicationVersion('Addressbook', '3.948');
		
	}*/
	
	public function update_947(){
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
					<name>bank_account_id</name>
					<type>integer</type>
					<notnull>false</notnull>
				</field>	
		    ');
       $this->_backend->addCol('addressbook', $declaration);
       
       $declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
					<name>bank_account_usage_id</name>
					<type>integer</type>
					<notnull>false</notnull>
				</field>	
		    ');
       $this->_backend->addCol('addressbook', $declaration);
       
       $this->setApplicationVersion('Addressbook', '3.948');
	}
	
	
	
}
