/*
 * Tine 2.0
 * 
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @copyright   Copyright (c) 2007-2008 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id: Model.js 14404 2010-05-18 15:58:41Z g.ciyiltepe@metaways.de $
 */
Ext.ns('Tine.Addressbook.Model');

try{
	Tine.Addressbook.Model.ContactArray = Tine.Addressbook.Model.ContactArray;
}catch(e){
	Tine.Addressbook.Model.ContactArray = [];
}

if(Tine.Addressbook.Model.ContactArray === undefined){
	Tine.Addressbook.Model.ContactArray = [];
}

Tine.Addressbook.Model.ContactArray = Tine.Addressbook.Model.ContactArray.concat([
    {name: 'id'},
    {name: 'tid'},
    {name: 'container_id'},
    {name: 'responsible_id'},
    {name: 'private'},
    {name: 'cat_id'},
    {name: 'n_family'},
    {name: 'n_given'},
    {name: 'n_middle'},
    {name: 'n_prefix'},
    {name: 'n_suffix'},
    {name: 'n_fn'},
    {name: 'n_fileas'},
    {name: 'bday', type: 'date', dateFormat: Date.patterns.ISO8601Short },
    {name: 'org_name'},
    {name: 'org_unit'},
    {name: 'salutation_id'},
    {name: 'title'},
    {name: 'role'},
    {name: 'assistent'},
    {name: 'room'},
    {name: 'adr_one_street'},
    {name: 'adr_one_street2'},
    {name: 'adr_one_locality'},
    {name: 'adr_one_region'},
    {name: 'adr_one_postalcode'},
    {name: 'adr_one_countryname'},
    {name: 'label'},
    {name: 'adr_two_street'},
    {name: 'adr_two_street2'},
    {name: 'adr_two_locality'},
    {name: 'adr_two_region'},
    {name: 'adr_two_postalcode'},
    {name: 'adr_two_countryname'},
    {name: 'tel_work'},
    {name: 'tel_cell'},
    {name: 'tel_fax'},
    {name: 'tel_assistent'},
    {name: 'tel_car'},
    {name: 'tel_pager'},
    {name: 'tel_home'},
    {name: 'tel_fax_home'},
    {name: 'tel_cell_private'},
    {name: 'tel_other'},
    {name: 'tel_prefer'},
    {name: 'email'},
    {name: 'email_home'},
    {name: 'url'},
    {name: 'url_home'},
    {name: 'freebusy_uri'},
    {name: 'calendar_uri'},
    {name: 'note'},
    {name: 'tz'},
    {name: 'lon'},
    {name: 'lat'},
    {name: 'pubkey'},
    {name: 'creation_time',      type: 'date', dateFormat: Date.patterns.ISO8601Long},
    {name: 'created_by',         type: 'int'                  },
    {name: 'last_modified_time', type: 'date', dateFormat: Date.patterns.ISO8601Long},
    {name: 'last_modified_by',   type: 'int'                  },
    {name: 'is_deleted',         type: 'boolean'              },
    {name: 'deleted_time',       type: 'date', dateFormat: Date.patterns.ISO8601Long},
    {name: 'deleted_by',         type: 'int'                  },
    {name: 'jpegphoto'},
    {name: 'account_id'},
    {name: 'tags'},
    {name: 'notes'},
    {name: 'relations'},
    {name: 'customfields'},
    {name: 'type'},
    
    // [EXTEND HH]: bankaccount data 2009-07-10
    // currently plain text, no validators
    // [CONSIDER]: use webservice to validate bank_code and retrieve bank_name
    {name: 'letter_salutation'},
    {name: 'bank_account_number'},
    {name: 'bank_code'},
    {name: 'bank_account_name'},
    {name: 'bank_name'},
    {name: 'busy_is_letter_address'},
    {name: 'busy_is_shipping_address'},
    {name: 'busy_is_invoice_address'},
	
	{name: 'company2'},
	{name: 'company3'},
	{name: 'adr3_is_invoice_address'},
	{name: 'adr3_is_letter_address'},
	{name: 'adr3_is_shipping_address'},
	{name: 'adr3_addition'},
	{name: 'adr3_street'},
	{name: 'adr3_postal_code'},
	{name: 'adr3_countryname'},
	{name: 'adr3_location'},
	{name: 'creditor_ext_id'},
	{name: 'debitor_ext_id'},
	{name: 'main_category_contact_id'},
	{name: 'contact_source_id'},
	{name: 'sodiac_sign'},
	/*{name: 'drinks_meeting_id'},
	{name: 'drinks_alcohol_id'},
	{name: 'eating_id'},
	{name: 'culture_art_id'},
	{name: 'tec_interest_id'},
	{name: 'politics_id'},
	{name: 'family_id'},
	{name: 'hobbies_id'},
	{name: 'social_networks_id'},
	{name: 'campaigns_id'},	*/
	{name: 'ksk'},
	{name: 'contact_type'},
	{name: 'orga_type'},
	{name: 'invoice_receiver'},
	{name: 'shipping_receiver'},
	{name: 'form_of_address'},
	{name: 'is_manual_form'},
	{name: 'is_manual_salutation'},
	{name: 'adr_one_co'},
	{name: 'adr_two_co'},
	{name: 'adr3_co'},
	{name: 'sex'},
	{name: 'is_locked'},
	{name: 'lock_comment'},
	{name: 'lock_date'},
	{name: 'adr4_addition'},
	{name: 'adr4_street'},
	{name: 'adr4_postal_code'},
	{name: 'adr4_location'},
	{name: 'adr4_countryname'},
	{name: 'adr4_co'},
	{name: 'tel_fax3'},
	{name: 'tel_fax4'},
	{name: 'tel3'},
	{name: 'tel4'},
	{name: 'tel_cell3'},
	{name: 'tel_cell4'},
	{name: 'email3'},
	{name: 'email4'},
	{name: 'url3'},
	{name: 'adr4_is_letter_address'},
	{name: 'adr4_is_shipping_address'},
	{name: 'adr4_is_invoice_address'},
	
	{name: 'person_leading'},
	{name: 'you_salutation'},				// DU-Anrede
	{name: 'nationality'},

	{name: 'official_title'},				//Amtstitel
	{name: 'adr_one_postbox'},
	//{name: 'adr_one_house_nr'},
	{name: 'adr_one_postbox_postal_code'},
	{name: 'adr_one_use_postbox'},
	
	{name: 'adr_two_postbox'},
	//{name: 'adr_two_house_nr'},
	{name: 'adr_two_postbox_postal_code'},
	{name: 'adr_two_use_postbox'},
	{name: 'adr3_postbox'},
	//{name: 'adr3_house_nr'},
	{name: 'adr3_postbox_postal_code'},
	{name: 'adr3_use_postbox'},
	{name: 'adr4_postbox'},
	//{name: 'adr4_house_nr'},
	{name: 'adr4_postbox_postal_code'},
	{name: 'adr4_use_postbox'},
	
	{name: 'adr_one_label'},
	{name: 'adr_two_label'},
	{name: 'adr3_label'},
	{name: 'adr4_label'}
]);

Tine.Addressbook.Model.ContactArray = Tine.Addressbook.Model.ContactArray.concat([
	

	
	{name: 'partner_forename'},
	{name: 'partner_lastname'},
	{name: 'partner_title'},
	{name: 'partner_salutation_id'},
	{name: 'partner_birthday',       type: 'date', dateFormat: Date.patterns.ISO8601Short},
	{name: 'partner_sex'},
	
	{name: 'contact_source'},		// Ursprung
	
	
	{name: 'province'},				//Bundesland
	{name: 'district'},				//Regierungsbezirk
	{name: 'county'},				//Kreis
	{name: 'community'},			//Gemeinde
	{name: 'community_key'},		//Gemeindeschlüssel
	{name: 'cultural_area'},		//Kulturraum
	
	
	{name: 'is_affiliator'},
	{name: 'affiliate_contact_id'},
	{name: 'affiliator_provision'},
	{name: 'affiliator_provision_date',       type: 'date', dateFormat: Date.patterns.ISO8601Short},
	{name: 'is_affiliated'},
	{name: 'count_magazines'},
	{name: 'count_additional_magazines'},
	{name: 'is_imported'},
	{name: 'user_former_system'},
	{name: 'info_letter_date',       type: 'date', dateFormat: Date.patterns.ISO8601Short}//,
	//{name: 'contact_multiple_criteria_id'}
]);

Ext.ns('Tine.Addressbook.ContactGridAdditionalColumns');

Tine.Addressbook.ContactGridAdditionalColumns.get = function(){
	var app = Tine.Tinebase.appMgr.get('Addressbook');
	
	return [
		
	];
};

/**
 * @namespace   Tine.Addressbook.Model
 * @class       Tine.Addressbook.Model
 * @extends     Tine.Addressbook.Model.Contact
 * Model of a contact<br>
 * 
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @version     $Id: Model.js 14404 2010-05-18 15:58:41Z g.ciyiltepe@metaways.de $
 */
Tine.Addressbook.Model.Contact = Tine.Tinebase.data.Record.create(Tine.Addressbook.Model.ContactArray, {
    appName: 'Addressbook',
    modelName: 'Contact',
    idProperty: 'id',
    titleProperty: 'n_fn',
    // ngettext('Contact', 'Contacts', n); gettext('Contacts');
    recordName: 'Contact',
    recordsName: 'Contacts',
    containerProperty: 'container_id',
    // ngettext('Addressbook', 'Addressbooks', n); gettext('Addressbooks');
    containerName: 'Addressbook',
    containersName: 'Addressbooks',
    getQualifiedTitle: function(){
    	if(this.get('sex') == 'NEUTRAL' && this.get('org_name')){
			return this.get('org_name') + ' ' + (this.get('company2')?this.get('company2'):'') + (this.get('n_family')?' AP: ' +this.getTitle(false):'');
		}else{
			return this.getTitle();
		}
    },
    getTitle: function(focusOrg) {
    	var addContactId = ' [# ' + this.get('id') + ' ] ';
		if(!focusOrg){
			return this.get('n_family') ? (this.get('n_family') + ' ' + this.get('n_given') + addContactId ) : (this.get('org_name')?this.get('org_name') + addContactId:'...');
		}else{
			return this.get('org_name') ? (this.get('org_name') + ' ' + this.get('company2') + addContactId):(this.get('n_fileas')?this.get('n_fileas') + addContactId:'...leer...');
		}
    },
	getLetterAddressAsHTML:function(_tagstart,_tagend){
		var sal = "";
		if(this.get('salutation_id')==2){
			sal = "Frau&nbsp;";
		}else if(this.get('salutation_id')==1){
			sal = "Herrn&nbsp;";
		}
		var address = _tagstart + sal + this.get('n_given')+"&nbsp;"+this.get('n_family')+_tagend;
		if(this.get('busy_is_letter_address')==='1'){
			address = _tagstart + this.get('org_name') + _tagend + address;
			address += _tagstart + this.get('adr_one_street')+_tagend+_tagstart+this.get('adr_one_postalcode')+"&nbsp;"+this.get('adr_one_locality')+_tagend;
		}else{
			address += _tagstart + this.get('adr_two_street')+_tagend+_tagstart+this.get('adr_two_postalcode')+"&nbsp;"+this.get('adr_two_locality')+_tagend;
		}
		return address;
	}
	
});


/**
 * get default data for a new contact
 * 
 * @namespace Tine.Addressbook.Model
 * @static
 * @return {Object} default data
 *
 *not usefull as long we don't use full records in the gird
 **/
Tine.Addressbook.Model.Contact.getDefaultData = function() { 
    var data = {};
    
    
    var app = Tine.Tinebase.appMgr.get('Addressbook');
    
    //var treeNode = app.getMainScreen().getWestPanel().getContainerTreePanel().getSelectionModel().getSelectedNode();
    var treeNode = Ext.getCmp('Addressbook_Tree') ? Ext.getCmp('Addressbook_Tree').getSelectionModel().getSelectedNode() : null;
    if (treeNode && treeNode.attributes && treeNode.attributes.containerType == 'singleContainer') {
        data.container_id = treeNode.attributes.container;
    } else {
        data.container_id = Tine.Addressbook.registry.get('defaultAddressbook');
    }
    
    data.main_category_contact_id = 0;
    data.contact_source_id = 0;
    data.sodiac_sign = 0;
    data.drinks_meeting_id = 0;
    data.drinks_alcohol_id = 0;
    data.eating_id = 0;
    data.culture_art_id = 0;
    data.tec_interest_id = 0;
    data.politics_id = 0;
    data.family_id = 0;
    data.hobbies_id = 0;
    data.social_networks_id = 0;
    data.campaigns_id = 0;
    data.age = 0;
    data.salo_op = 0;
    data.turnover_last_year = 0;
    data.turnover_year = 0;
    
    return data;
};

/**
 * get filtermodel of contact model
 * 
 * @namespace Tine.Addressbook.Model
 * @static
 * @return {Object} filterModel definition
 */ 
Tine.Addressbook.Model.Contact.getFilterModel = function() {
    var app = Tine.Tinebase.appMgr.get('Addressbook');
    
    var typeStore = [['contact', app.i18n._('Contact')], ['user', app.i18n._('User Account')]];
    
    var filterModels = [
        {label: _('Quick search'),                                                      field: 'query',              operators: ['contains']},
        {filtertype: 'tine.widget.container.filtermodel', app: app, recordClass: Tine.Addressbook.Model.Contact},
        {label: app.i18n._('Hauptkategorie'),  field: 'main_category_contact_id',  valueType: 'combo', valueField:'id', displayField:'name', 
           	store:Sopen.GenericAttribute.getStore('main_category_contact_id')},
        {label: app.i18n._('Art Kontakt'),  field: 'contact_type',  valueType: 'combo', valueField:'id', displayField:'name', operators: ['equals','not'], 
               	store:[['orga', 'Firma/Organisation'],['person','Person'],['family', 'Familie/Gemeinschaft']]},
        {label: app.i18n._('First Name'),                                               field: 'n_given' },
        {label: app.i18n._('Last Name'),                                                field: 'n_family'},
        {label: app.i18n._('Birthday'),    field: 'bday', valueType: 'date'},
        {label: app.i18n._('Geschlecht'),  field: 'sex',  valueType: 'combo', valueField:'id', displayField:'name', operators: ['equals','not'], 
           	store:[['MALE','männlich'],['FEMALE','weiblich'],['NEUTRAL','neutral']]},
       
        {label: app.i18n._('Company'),                                                  field: 'org_name'},
        {label: app.i18n._('Firma2'),                                                  field: 'company2'},
        {label: app.i18n._('Firma3'),                                                  field: 'company3'},
        
        {label: app.i18n._('Phone'),                                                    field: 'telephone',          operators: ['contains']},
        {label: app.i18n._('Job Title'),                                                field: 'title'},
        {label: app.i18n._('Job Role'),                                                 field: 'role'},
        {label: app.i18n._('Note'),                                                     field: 'note'},
        {filtertype: 'tinebase.tag', app: app},
       
        {label: app.i18n._('Street') + ' (' + app.i18n._('Company Address') + ')',      field: 'adr_one_street',     defaultOperator: 'equals'},
        {label: app.i18n._('Postal Code') + ' (' + app.i18n._('Company Address') + ')', field: 'adr_one_postalcode', defaultOperator: 'equals'},
        {label: app.i18n._('City') + '  (' + app.i18n._('Company Address') + ')',       field: 'adr_one_locality'},
        {label: app.i18n._('Country') + '  (' + app.i18n._('Company Address') + ')',       field: 'adr_one_countryname', operators:['equals','not']},
        {label: app.i18n._('Street') + ' (' + app.i18n._('Private Address') + ')',      field: 'adr_two_street',     defaultOperator: 'equals'},
        {label: app.i18n._('Postfach nutzen'),   field: 'adr_one_use_postbox',  valueType: 'bool'},
        
        {label: app.i18n._('Postal Code') + ' (' + app.i18n._('Private Address') + ')', field: 'adr_two_postalcode', defaultOperator: 'equals'},
        {label: app.i18n._('City') + ' (' + app.i18n._('Private Address') + ')',        field: 'adr_two_locality'},
        {label: app.i18n._('Type'), defaultValue: 'contact', valueType: 'combo',        field: 'type',               store: typeStore},
        {label: app.i18n._('Last modified'),                                            field: 'last_modified_time', valueType: 'date'},
        {label: app.i18n._('Last modifier'),                                            field: 'last_modified_by', valueType: 'user'},
        {label: app.i18n._('Creation Time'),                                            field: 'creation_time', valueType: 'date'},
        {label: app.i18n._('Creator'),                                                  field: 'created_by', valueType: 'user'},
        {label: app.i18n._('Kontonummer'), field: 'bank_account_number' },
        {label: app.i18n._('gesperrt'),   field: 'is_locked',  valueType: 'bool'},
        {label: app.i18n._('Partner Vorname'),       field: 'partner_forename' },
        {label: app.i18n._('Partner Nachname'),      field: 'partner_lastname'},
        {label: app.i18n._('Geschl.Part.'),  field: 'partner_sex',  valueType: 'combo', valueField:'id', displayField:'name', operators: ['equals','not'], 
           	store:[['MALE','männlich'],['FEMALE','weiblich'],['NEUTRAL','neutral']]},
        {label: app.i18n._('Partner-Geb.'),    field: 'partner_birthday', valueType: 'date'},
            
        {label: app.i18n._('Ursprung'), field: 'contact_source' },
        {label: app.i18n._('Bundesland'), field: 'province' },
        {label: app.i18n._('Reg.bez.'), field: 'district' },
        {label: app.i18n._('Kreis'), field: 'county' },
        {label: app.i18n._('Gemeinde'), field: 'community' },
        {label: app.i18n._('Gemeindeschlüssel'), field: 'community_key' },
        {label: app.i18n._('Kulturraum'), field: 'cultural_area' },
        {label: app.i18n._('ist Werber'), field: 'is_affiliator',  valueType: 'bool' },
        {label: app.i18n._('ist geworben'), field: 'is_affiliated',  valueType: 'bool' },
        {label: app.i18n._('Werber-Nr'), field: 'affiliate_contact_id', valueType:'number', operators: ['greater','less','equals']  },
        {label: app.i18n._('Werber.Prov.Datum'), field: 'affiliator_provision_date', valueType: 'date' },
        {label: app.i18n._('Werber.Provision Betrag'), field: 'affiliator_provision', valueType:'number', operators: ['greater','less','equals'] },
        {label: app.i18n._('Anz. Zeitungen'), field: 'count_magazines', valueType:'number', operators: ['greater','less','equals']  },
        {label: app.i18n._('Anz. zus. Zeitungen'), field: 'count_additional_magazines', valueType:'number', operators: ['greater','less','equals']  },
        {label: app.i18n._('ist importiert'), field: 'is_imported',  valueType: 'bool' },
        {label: app.i18n._('Benutzer Altsystem'), field: 'user_former_system' },
        {label: app.i18n._('Datum Infoschreiben'), field: 'info_letter_date', valueType: 'date' }
    ];
    
    var cats = Tine.SCrm.getCriteriaCategoryDefinitionFromRegistry();
	
	var categories = new Ext.util.MixedCollection();
	categories.addAll(cats);
	
	categories.each(function(item){
		var selectorFilters = [{field:'scrm_criteria_category_id',operator:'AND',value:[{field:'key',operator:'equals',value:item.key}]}];
		var mod = Tine.Addressbook.Model.ContactMultipleCriteria.getMultipleCriteriaContactFilterModel(selectorFilters);
		mod.id = 'cmc_ids_' + item.key;
		mod.useSubFilters = false;
		mod.label=item.name;
		mod.field = 'contact_multiple_criteria_id_' + item.key;
		filterModels.push(
			mod
		);
	},this);
	
	filterModels.push(
		{app: app, filtertype: 'foreignrecord', getFilterMethod:'getFilterModelForContact', label: 'Mitglied', field: 'member_id', foreignRecordClass: Tine.Membership.Model.SoMember, ownField:'member_id'}	
	);
	
	
	return filterModels;
	
};

/**
 * default timesheets backend
 */
Tine.Addressbook.contactBackend = new Tine.Tinebase.data.RecordProxy({
    appName: 'Addressbook',
    modelName: 'Contact',
    recordClass: Tine.Addressbook.Model.Contact
});

/**
 * salutation model
 */
Tine.Addressbook.Model.Salutation = Ext.data.Record.create([
   {name: 'id'},
   {name: 'name'},
   {name: 'gender'}
]);


/**
 * get salutation store
 * if available, load data from initial data
 * 
 * @return Ext.data.JsonStore with salutations
 */
Tine.Addressbook.getSalutationStore = function() {
    
    var store = Ext.StoreMgr.get('AddressbookSalutationStore');
    if (!store) {

        store = new Ext.data.JsonStore({
            fields: Tine.Addressbook.Model.Salutation,
            baseParams: {
                method: 'Addressbook.getSalutations'
            },
            root: 'results',
            totalProperty: 'totalcount',
            id: 'id',
            remoteSort: false
        });
        
        if (Tine.Addressbook.registry.get('Salutations')) {
            store.loadData(Tine.Addressbook.registry.get('Salutations'));
        }
        
            
        Ext.StoreMgr.add('AddressbookSalutationStore', store);
    }
    
    return store;
};

Tine.Addressbook.Model.ContactRelationDescriptorArray = [
	{name: 'id'},
	{name: 'key'},
	{name: 'name'},
	{name: 'description'},
	{name: 'degree'}
];

Tine.Addressbook.Model.ContactRelationDescriptor = Tine.Tinebase.data.Record.create(Tine.Addressbook.Model.ContactRelationDescriptorArray, {
	appName: 'Addressbook',
	modelName: 'ContactRelationDescriptor',
	idProperty: 'id',
	titleProperty: '',
	recordName: 'Kontakt Beziehung',
	recordsName: 'Kontakt Beziehungen',
	containerProperty: 'id',
	containerName: 'RElDec',
	containersName: 'RElDec',
	getTitle: function(){
		return this.get('name') + " #" + this.get('key');
	}
});

Tine.Addressbook.contactRelationDescriptorBackend = new Tine.Tinebase.data.RecordProxy({
    appName: 'Addressbook',
    modelName: 'ContactRelationDescriptor',
    recordClass: Tine.Addressbook.Model.ContactRelationDescriptor
});

Tine.Addressbook.Model.ContactContactArray = [
	{name: 'id'},
	{name: 'from_contact_id'},
	{name: 'to_contact_id'},
	{name: 'relation_descriptor_id'},
	{name: 'start_time',      	type: 'date', dateFormat: Date.patterns.ISO8601Long},
	{name: 'end_time',      	type: 'date', dateFormat: Date.patterns.ISO8601Long},
    {name: 'creation_time',      type: 'date', dateFormat: Date.patterns.ISO8601Long},
    {name: 'created_by',         type: 'int'                  },
    {name: 'last_modified_time', type: 'date', dateFormat: Date.patterns.ISO8601Long},
    {name: 'last_modified_by',   type: 'int'                  },
    {name: 'is_deleted',         type: 'boolean'              },
    {name: 'deleted_time',       type: 'date', dateFormat: Date.patterns.ISO8601Long},
    {name: 'deleted_by',         type: 'int'                  }	
];

Tine.Addressbook.Model.ContactContact = Tine.Tinebase.data.Record.create(Tine.Addressbook.Model.ContactContactArray, {
	appName: 'Addressbook',
	modelName: 'ContactContact',
	idProperty: 'id',
	titleProperty: '',
	recordName: 'Verknüpfter Kontakt',
	recordsName: 'Verknüpfte Kontakte',
	containerProperty: 'id',
	containerName: '',
	containersName: '',
	getTitle: function(){
		return this.get('relation_descriptor_id').get('name');
	}
});

Tine.Addressbook.contactContactBackend = new Tine.Tinebase.data.RecordProxy({
    appName: 'Addressbook',
    modelName: 'ContactContact',
    recordClass: Tine.Addressbook.Model.ContactContact
});

Tine.Addressbook.getArrayFromRegistry = function(registryKey){
	if(registryKey.indexOf('.')>-1){
		var keys = registryKey.split('.');
		var array = Tine.Addressbook.registry.get(keys[0]);
		var strIndex = '';
		var prefix = '';
		for(var i = 1; i<keys.length;i++){
			strIndex +=  prefix + keys[i];
			if(prefix==''){
				prefix = '.';
			}
		}
		return array[strIndex];
	}else if (Tine.Addressbook.registry.get(registryKey)) {
		return Tine.Addressbook.registry.get(registryKey);
	}
	return [];
};


/**
 * Contact person 
 *
 * @var {Array} Tine.Addressbook.Model.ContactPersonArray
 */
Tine.Addressbook.Model.ContactPersonArray = [
   {name: 'id'},
   {name: 'contact_id'},
   {name: 'contact_person_id'},
   {name: 'is_main_contact_person'}
];

/**
 * Contact person
 *
 * @class {Tine.Addressbook.Model.ContactPerson} Contact person
 * @extends {Tine.Tinebase.data.Record} Tine Record
 */
Tine.Addressbook.Model.ContactPerson = Tine.Tinebase.data.Record.create(Tine.Addressbook.Model.ContactPersonArray, {
    appName: 'Addressbook',
    modelName: 'ContactPerson',
    idProperty: 'id',
    titleProperty: 'name',
    containerProperty: null,
    relations: [
        {
            name: 'contact_person',
            model: Tine.Addressbook.Model.Contact,
            fkey: 'contact_person_id',
            embedded : true,
            emissions:[
                {dest: {name: 'contact_person_id'}, source: function(contact){return contact.getId();}},
                {dest: {name: 'salutation_id'}, source: function(contact){return contact.get('salutation_id');}},
                {dest: {name: 'n_given'}, source: function(contact){return contact.get('n_given');}},
                {dest: {name: 'n_prefix'}, source: function(contact){return contact.get('n_prefix');}},
                {dest: {name: 'n_family'}, source: function(contact){return contact.get('n_family');}},
                {dest: {name: 'manager_kind'}, source: function(contact){return contact.get('manager_kind');}},
                {dest: {name: 'org_unit'}, source: function(contact){return contact.get('org_unit');}},
                {dest: {name: 'tel_work'}, source: function(contact){return contact.get('tel_work');}},
                {dest: {name: 'tel_cell'}, source: function(contact){return contact.get('tel_cell');}},
                {dest: {name: 'email'}, source: function(contact){return contact.get('email');}},
                {dest: {name: 'unit'}, source: function(contact){return contact.get('unit');}}
            ]
        }
    ]
});


Tine.Addressbook.Model.ContactPerson.getDefaultData = function() { 
   var data = {};
   return data;
};

Tine.Addressbook.Model.ContactPerson.getFilterModel = function() {
   var app = Tine.Tinebase.appMgr.get('Addressbook');
   return [
        {label: _('Quick search'), field: 'query', operators: ['contains']},
        {label: app.i18n._('First Name'),field: 'n_given' },
        {label: app.i18n._('Last Name'),field: 'n_family'},
   ];
};

Tine.Addressbook.contactPersonBackend = new Tine.Tinebase.data.RecordProxy({
   appName: 'Addressbook',
   modelName: 'ContactPerson',
   recordClass: Tine.Addressbook.Model.ContactPerson
});



/**
 * Contact multiple criteria 
 *
 * @var {Array} Tine.Addressbook.Model.ContactMultipleCriteriaArray
 */
Tine.Addressbook.Model.ContactMultipleCriteriaArray = [
   {name: 'id'},
   {name: 'contact_id'},
   {name: 'scrm_multiple_criteria_id'},
   {name: 'scrm_criteria_category_id'},
   {name: 'has_criteria'},
   {name: 'percentage'},
   {name: 'key'},
   {name: 'name'},
   {name: 'description'},
   {name: 'category_key'},
   {name: 'category_name'}
];

/**
 * Contact person
 *
 * @class {Tine.Addressbook.Model.ContactMultipleCriteria} Contact person
 * @extends {Tine.Tinebase.data.Record} Tine Record
 */
Tine.Addressbook.Model.ContactMultipleCriteria = Tine.Tinebase.data.Record.create(Tine.Addressbook.Model.ContactMultipleCriteriaArray, {
    appName: 'Addressbook',
    modelName: 'ContactMultipleCriteria',
    idProperty: 'id',
    titleProperty: 'name',
    containerProperty: null
});


Tine.Addressbook.Model.ContactMultipleCriteria.getDefaultData = function() { 
   var data = {};
   return data;
};

Tine.Addressbook.Model.ContactMultipleCriteria.getFilterModel = function() {
   var app = Tine.Tinebase.appMgr.get('Addressbook');
   return [
       {label: _('Quick search'), field: 'query', operators: ['contains']}
   ];
};

Tine.Addressbook.Model.ContactMultipleCriteria.getFilterModelBool = function() {
   var app = Tine.Tinebase.appMgr.get('Addressbook');
   return [
       {label: _('Quick search'), field: 'query', operators: ['contains']}
   ];
};


Tine.Addressbook.Model.ContactMultipleCriteria.getMultipleCriteriaContactFilterModel = function(selectorFilters) {
   var app = Tine.Tinebase.appMgr.get('Addressbook');
   var filter = {
	   app: app, 
	   filtertype: 'dependentrecord', 
	   label: 'Kriterium', 
	   field: 'contact_multiple_criteria_id', 
	   defaultOperator:'in',
	   //dependentRecordClass: Tine.Addressbook.Model.ContactMultipleCriteria, 
	   dependentRecordClass: Tine.SCrm.Model.MultipleCriteria,
	   selectorFilters: selectorFilters,
	   ownField:'id', 
	   dependentField:'contact_id'
   };
   
   //filter.initialize();
   return filter;
};



Tine.Addressbook.Model.ContactMultipleCriteria.getContactFilterModels = function() {
   var app = Tine.Tinebase.appMgr.get('Addressbook');

   
};


Tine.Addressbook.contactMultipleCriteriaBackend = new Tine.Tinebase.data.RecordProxy({
   appName: 'Addressbook',
   modelName: 'ContactMultipleCriteria',
   recordClass: Tine.Addressbook.Model.ContactMultipleCriteria
});
