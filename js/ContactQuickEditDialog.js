Ext.namespace('Tine.Addressbook');

Tine.Addressbook.quickCreateLetterSalutation = function(_salcombo,_salrecord,_salindex){
	try{
		_salindex = Ext.getCmp('salutation_id').getValue()-1;
	}catch(e){
		return;
	}
 	
 	var lMap = ['Sehr geehrter Herr PREFIXNAME,', 'Sehr geehrte Frau PREFIXNAME,', 'Sehr geehrte Damen und Herren,', 'Sehr geehrte Frau NAME, \nSehr geehrter Herr NAME,'];
	var letterSal = lMap[_salindex];
	var title;
	var prefix;
	var formOfAddress = '';
	if(_salindex == 0){
		Ext.getCmp('contact_sex').setValue('MALE');
		formOfAddress = 'Herrn';
	}else if(_salindex == 1){
		formOfAddress = 'Frau';
		Ext.getCmp('contact_sex').setValue('FEMALE');
	}else{
		Ext.getCmp('contact_sex').setValue('NEUTRAL');
	}
 	switch(_salindex){
 	case 0:
	case 1:
	case 3:
			try{
				title = Tine.Addressbook.getSoContactTitleStore().getById(Ext.getCmp('n_prefix').getValue()).get('name');
			}catch(e){
				title = null;
			}
			try{
				prefix = (parseInt(Ext.getCmp('n_prefix').getValue(),10)>0)?title+" ":"";
			}catch(e){
				prefix = null;
			}
			letterSal = letterSal.replace(/PREFIX/, prefix).replace(/NAME/g, Ext.getCmp('last_name_id').getValue());

		break;
 	}
 	try{
	 	var valueFormOfAddress = Ext.getCmp('form_of_address').getValue();
	 	var fieldFormOfAddress = Ext.getCmp('form_of_address');
	 	
	 	/*if(formOfAddress){
	 		formOfAddress += prefix +  Ext.getCmp('last_name_id').getValue();
	 	}*/
	 	if(!fieldFormOfAddress.disabled){
	 		Ext.getCmp('form_of_address').setValue(formOfAddress);
	 	}
 	}catch(e){
 		//
 	}
 	var field = Ext.getCmp('letter_salutation');
 	
 	if(field && !field.disabled){
 		field.setValue(letterSal);
 	}
};

Tine.Addressbook.appendLetterSalutation = function(_salcombo,_salrecord,_salindex){
	
};

Tine.Addressbook.ContactQuickEditDialog = Ext.extend(Tine.widgets.dialog.EditDialog, {
	
	/**
	 * @private
	 */
	windowNamePrefix: 'ContactQuickEditWindow_',
	appName: 'Addressbook',
	recordClass: Tine.Addressbook.Model.Contact,
	recordProxy: Tine.Addressbook.contactBackend,
	loadRecord: true,
	evalGrants: false,
	additionalFields:[],
	useBankDataHelper: true,
	additionalFieldNames:[],
	deferredRender:false,
	bankAccountWidget:null,
	ddConfig:{
	   	ddGroupContact: 'ddGroupContact',
	   	ddGroupGetContact: 'ddGroupGetContact'
	},
	initComponent: function(){
		//this.initActions();
		this.postalCodeHelpers = new Ext.util.MixedCollection();
		this.bankDataHelpers = new Ext.util.MixedCollection();
		this.app = Tine.Tinebase.appMgr.get('Addressbook');
		
		this.duplicateCheckWidget = new Tine.Addressbook.DuplicateCheckWidget({
    		forceLayout:true,
    		deferredRender:false,
			height:200,
    		collapsed:true,
    		collapsible:true,
    		collapseMode:'mini',
    		region:'north',
    		header:false,
    		layout:'fit',
    		split:true,
    		border:false,
    		frame:true
    	});
    	
    	this.duplicateCheckWidget.doLayout();
    	
    	this.duplicateCheckWidget.on('ignoreduplicates', this.onAnswerDuplicateQuestion.createDelegate(this,['yes']));
    	this.duplicateCheckWidget.on('respectduplicates', this.onAnswerDuplicateQuestion.createDelegate([this,'no']));
    	this.duplicateCheckWidget.on('duplicatesfound', this.onDuplicatesFound, this);
    	this.duplicateCheckWidget.on('noduplicatesfound', this.onNoDuplicatesFound, this);
    	this.duplicateCheckWidget.on('duplicatecheckfailed', this.onDuplicateCheckFailed, this);
    	
    	
    	
		this.on('load',this.onLoadContact, this);
		this.on('afterrender',this.onAfterRender,this);
		//this.initDependentGrids();
		Tine.Addressbook.ContactQuickEditDialog.superclass.initComponent.call(this);
	},
	onDuplicatesFound: function(count, ids, duplicateWidget){
    	//this.getContactMainDataPanel().add(this.duplicateCheckWidget);
    	this.duplicateCheckWidget.expand();
    },
    onNoDuplicatesFound: function(count, ids, duplicateWidget){
    	//this.getContactMainDataPanel().remove(this.duplicateCheckWidget);
    	this.duplicateCheckWidget.collapse();
    	this.finalizeApply(
    		this.bufferIntermediateApply.params.button,
    		this.bufferIntermediateApply.params.event,
    		this.bufferIntermediateApply.params.closeWindow
    	);
    },
    onDuplicateCheckFailed: function(duplicateWidget){
    	//this.getContactMainDataPanel().remove(this.duplicateCheckWidget);
    	this.duplicateCheckWidget.collapse();
    	this.finalizeApply();
    },
	onLoadContact: function(){
		if(!this.record.isNew()){
			
			
		}
		
		//this.bankAccountWidget.finalize();
	},
	onBeforeCloseChangeDialog: function(){
		this.initRecord();
		return true;
	},
	/*initActions: function(){
		
		// get actions from Api and bind handlers to api instance
		// this is for using actions together with grid (no code duplication necessary anymore)
		Tine.Addressbook.Api.Contact.getActions(this);
		this.tbar = new Ext.Toolbar();
        this.tbar.add(this.action_confirmContact, this.actions_rebooking, this.action_requestPayout);
        this.supr().initActions.call(this);
	},*/
	onAfterRender: function(){
		this.initDropZone();
    	this.postalCodeHelpers.add(new Tine.Addressbook.PostalAddressHelper().initialize(
    			'adr_one_postalcode', 'adr_one_locality', 'adr_one_countryname' 
    	));
    	
    	/*if(this.bankDataHelpers.getCount()==0){
    		this.bankDataHelpers.add(new Tine.Billing.BankDataHelper().initialize(
    				'bank_code', 'bank_name', 'bank_account_number' , 'bank_account_name' 
    		));
    	}else{
    		this.bankDataHelpers.each(
				function(item){
					item.updateFromForm();
				},
				this
			);
    	}
    	
    	Ext.getCmp('bank_account_name').addListener('focus', this.presetBankName, this);*/
    	
	}, 
	initDropZone: function(){
    	if(!this.ddConfig){
    		return;
    	}
		this.dd = new Ext.dd.DropTarget(this.el, {
			scope: this,
			ddGroup     : this.ddConfig.ddGroupContact,
			notifyEnter : function(ddSource, e, data) {
				this.scope.el.stopFx();
				this.scope.el.highlight();
			},
			notifyDrop  : function(ddSource, e, data){
				return this.scope.onDrop(ddSource, e, data);
			}
		});
		this.dd.addToGroup(this.ddConfig.ddGroupGetContact);
	},
	
	extractRecordFromDrop: function(ddSource, e, data){
		var source = data.selections[0];
		var record = null;
		switch(ddSource.ddGroup){
		case 'ddGroupContact':
			var source = data.selections[0];
			record = source;
			break;
			
		case 'ddGroupGetContact':
			if(source.getContact !== undefined && typeof(source.getContact)==='function'){
				record = source.getContact();
			}
			break;
		}
		return record;
	},
	
	onDrop: function(ddSource, e, data){
		var record = this.extractRecordFromDrop(ddSource, e, data);
		if(!record){
			return false;
		}
		this.record = record;
		this.initRecord();
		return true;
	},
	presetBankName: function(){
    	var bankName = Ext.getCmp('bank_account_name').getValue();
    	if(!bankName){
    		this.onRecordUpdate();
    		Ext.getCmp('bank_account_name').setValue(this.record.get('n_given') + ', ' + this.record.get('n_family'));
    	}
    },
	getSelectedRecord: function(){
		return this.record;
	},
	getAdditionalValues: function(){
		var result = {};
		var fieldValues = this.getForm().getFieldValues();
		
		/*for(var i in this.additionalFieldNames){
			if(typeof(this.additionalFieldNames[i])=='string'){
				result[this.additionalFieldNames[i]] = fieldValues[this.additionalFieldNames[i]];
			}
		}*/
		
		return result;
	},
	getFormItems: function() {
		var fields = Tine.Addressbook.ContactQuickFormFields.get(this.app);
		var baseFields = 
			[[
			  Ext.apply(fields.salutation,{width:80}), fields.sex, fields.title, Ext.apply(fields.n_given, {width:100}),  Ext.apply(fields.n_family,{width:210})
			],[
			  Ext.apply(fields.partner_salutation,{width:80}), fields.partner_sex, fields.partner_title, Ext.apply(fields.partner_forename, {width:100}),  Ext.apply(fields.partner_lastname,{width:210})
			],[
		       fields.org_name, fields.company2, Ext.apply(fields.country,{width:140})
          	],[
          	  fields.street, fields.postal_code, fields.city
            ],[
              fields.letter_salutation, fields.birth_date
            ]];
		/*if(this.additionalFields){
			var coll = new Ext.util.MixedCollection();
			var result = {
				resultArray: new Array(),
				fields: fields
			};
			coll.addAll(this.additionalFields);
			coll.each(function(item){
				console.log(this.fields);
				console.log(item);
				var aItem = [];
				for(var i in item){
					try{
						if(typeof(item[i])==='string'){
							aItem.push(this.fields[item[i]]);
						}else if(typeof(item[i]) !== 'function' && typeof(item[i])==='object'){
							aItem.push(item[i]);
						}
						
					}catch(e){
						//
					}
				}
				console.log(aItem);
				this.resultArray.push(aItem);
			},result);
			
			baseFields = baseFields.concat(result.resultArray);
		}*/
		var mainPanel =
		{
        	xtype:'panel',
        	region: 'center',
        	height:550,
        	frame:true,
        	layout:'border',
        	
        	items:[
this.duplicateCheckWidget,
        	       {
            	xtype:'panel',
            	region: 'center',
            	  autoScroll:true,
            	items:[
            	       {   xtype:'columnform',
            	    	 
            	    	   
            	    	   items: baseFields
            	                                       	
            	       }
            	   ]
        	}]
        };
			
		return mainPanel;
	},
	onApplyChanges: function(button, event, closeWindow) {

		//this.finalizeApply(button, event, closeWindow);
        
        if(this.record.isNew()){
        	this.intermediateApply(button, event, closeWindow);
        }else{
        	this.duplicateCheckWidget.collapse();
        	this.finalizeApply(button, event, closeWindow);
        }
    },
    checkDuplicateRecords: function(){
    	this.onRecordUpdate();
    	this.duplicateCheckWidget.checkForDuplicates(this.record.data, this.record.isNew());
    },
    intermediateApply: function(button, event, closeWindow){
    	this.bufferIntermediateApply = {
    			params: {
    				button: button,
    	    		event: event,
    	    		closeWindow: closeWindow
    			},
    			result: {}
    	};
    	this.checkDuplicateRecords();
	},

	onAnswerDuplicateQuestion: function(btn, text){
		if(btn == 'yes'){
			this.duplicateCheckWidget.collapse();
			this.finalizeApply(this.bufferIntermediateApply.params.button, this.bufferIntermediateApply.params.event, this.bufferIntermediateApply.params.closeWindow);
		}else{
			
		}
	},
    finalizeApply: function(button, event, closeWindow){
    	Tine.Addressbook.ContactEditDialog.superclass.onApplyChanges.call(this,button, event, closeWindow); 
    }
});

/**
 * Addressbook Edit Popup
 */
Tine.Addressbook.ContactQuickEditDialog.openWindow = function (config) {
    var id = (config.record && config.record.id) ? config.record.id : 0;
    var window = Tine.WindowFactory.getWindow({
        width: 700,
        height: 550,
        modal:true,
        name: Tine.Addressbook.ContactQuickEditDialog.prototype.windowNamePrefix + id,
        contentPanelConstructor: 'Tine.Addressbook.ContactQuickEditDialog',
        contentPanelConstructorConfig: config
    });
    return window;
};


Ext.ns('Tine.Addressbook.ContactQuickFormFields');

Tine.Addressbook.ContactQuickFormFields.get = function(app){
	return{
		// hidden fields
		id: 
			{xtype: 'textfield',id:'id',name:'id', disabled:true, width:100},
		org_name:
		{
			width:250,
		    xtype: 'textfield',
		    fieldLabel: app.i18n._('Company'), 
		    name:'org_name',
		    maxLength: 64
		},
		url:
		{
        	xtype: 'mirrortextfield',
            fieldLabel: app.i18n._('Web'),
            labelIcon: 'images/oxygen/16x16/actions/network.png',
            name:'url',
            vtype:'url',
            listeners: {
                scope: this,
                focus: function(field) {
                    if (! field.getValue()) {
                        field.setValue('http://www.');
                    }
                },
                blur: function(field) {
                    if (field.getValue() == 'http://www.') {
                        field.setValue(null);
                        field.validate();
                    }
                }
            }
        },
        customer_value:
		{
			fieldLabel: 'Kundenwert',
		    disabledClass: 'x-item-disabled-view',
		    name:'customer_value',
		    width: 120,
		    xtype:'combo',
		    store:[['aaa','A++'],['aa','A+'],['a', 'A'],['b','B'],['c','C']],
		    value: 'A',
			mode: 'local',
			displayField: 'name',
		    valueField: 'id',
		    triggerAction: 'all'
		},
		contact_nr:
			{
			    fieldLabel: 'Mittel-Nr',
			    id:'contact_contact_nr',
			    emptyText:'<automatisch>',
			    name:'contact_nr',
			    disabledClass: 'x-item-disabled-view',
			    disabled:true,
			    value:null,
			    width: 100
			},
		street:
		{
        	width:250,
            fieldLabel: app.i18n._('Street'), 
            name:'adr_one_street'
        },
		postal_code:
		{
        	xtype:'combo',
        	width:80,
        	hideTrigger:true,
            fieldLabel: app.i18n._('Postal Code'), 
            id:'adr_one_postalcode',
            name:'adr_one_postalcode'
        },
		city:
		{
        	xtype:'combo',
        	width:260,
        	hideTrigger:true,
            fieldLabel: app.i18n._('City'),
            store:[],
            id:'adr_one_locality',
            name:'adr_one_locality'
        },
		country:
		{
        	width:220,
            xtype: 'widget-countrycombo',
            fieldLabel: app.i18n._('Country'),
            id:'adr_one_countryname',
            name: 'adr_one_countryname',
            value:'DE',
            hiddenValue: 'Deutschland'
        },
		phone:
		{
     		fieldLabel: app.i18n._('Phone'), 
            labelIcon: 'images/oxygen/16x16/apps/kcall.png',
            name:'tel_work'
        },
		email:
		{
            fieldLabel: app.i18n._('E-Mail'), 
            labelIcon: 'images/oxygen/16x16/actions/kontact-mail.png',
            name:'email',
            vtype: 'email'
        },
        salutation:
        {
			width:100,
		    fieldLabel: app.i18n._('Salutation'),
		    xtype: 'combo',
		    store: Tine.Addressbook.getSalutationStore(),
		    id: 'salutation_id',
		    name: 'salutation_id',
		    mode: 'local',
		    displayField: 'name',
		    valueField: 'id',
		    triggerAction: 'all',
		// [ADAPT HH]: temp, unlocalized, hardcoded extension                            
		    listeners:{
				scope: this,
				'select': Tine.Addressbook.quickCreateLetterSalutation
			}
		},
        
	   title:
	    	new Ext.ux.form.ClearableComboBox({
				width:120,
			    fieldLabel: app.i18n._('Title'), 
			    store:Tine.Addressbook.getSoContactTitleStore(),
			    name:'n_prefix',
			    id: 'n_prefix',
			    mode: 'local',
			    displayField: 'name',
			    valueField: 'id',
			    triggerAction: 'all',
			    listeners:{
					scope: this,
					'change': Tine.Addressbook.quickCreateLetterSalutation
				}
			}),
	    n_given:
	    {
			width:160,
		    fieldLabel: app.i18n._('First Name'), 
		    id: 'first_name_id',
		    name:'n_given',
		    listeners:{
				scope: this,
				'change': Tine.Addressbook.quickCreateLetterSalutation
			}
		},
		n_family:
		{
			width:200,
		    fieldLabel: app.i18n._('Last Name'),
		    id: 'last_name_id',
		    name:'n_family',
		    listeners:{
				scope: this,
				'change': Tine.Addressbook.quickCreateLetterSalutation
			}
		    
		},
	    phone_ap:
	    {
	    	width:150,
     		fieldLabel: app.i18n._('Telefon AP'), 
            labelIcon: 'images/oxygen/16x16/apps/kcall.png',
            name:'tel3'
        },
        mobile_ap:
	    {
        	width:150,
     		fieldLabel: app.i18n._('Mobil AP'), 
            labelIcon: 'images/oxygen/16x16/apps/kcall.png',
            name:'tel_cell3'
        },
		email_ap:
		{
			width:280,
            fieldLabel: app.i18n._('eMail AP'), 
            labelIcon: 'images/oxygen/16x16/actions/kontact-mail.png',
            name:'email3',
            vtype: 'email'
        },
	    profession:
			{
		 		xtype: 'textfield',
		    	fieldLabel: 'Beruf', 
			    name:'profession',
		    	disabledClass: 'x-item-disabled-view',
		    	blurOnSelect: true,
		 	    width:290
		 	},
	    function_category:
			{
		 		xtype: 'textfield',
		    	fieldLabel: 'Funktionskategorie', 
			    name:'function_category',
		    	disabledClass: 'x-item-disabled-view',
		    	blurOnSelect: true,
		 	    width:290
		 	},
	    hierarchy_level:
			{
		 		xtype: 'textfield',
		    	fieldLabel: 'Hierarchie-Ebene', 
			    name:'hierarchy_level',
		    	disabledClass: 'x-item-disabled-view',
		    	blurOnSelect: true,
		 	    width:290
		 	},
	    manager_kind:
			{
		 		xtype: 'textfield',
		    	fieldLabel: 'Art Entscheider', 
			    name:'manager_kind',
		    	disabledClass: 'x-item-disabled-view',
		    	blurOnSelect: true,
		 	    width:290
		 	},
		address_lock:
		{
			xtype:'checkbox',
			hideLabel: true,
			boxLabel: 'Opt out',
		    name:'is_locked',
		    width: 100
		},
		revenue:
		{
			xtype:'sopencurrencyfield',
			fieldLabel: 'Umsatz',
		    name:'revenue',
		    width: 100
		},
		employees:
		{
			fieldLabel: 'Anz. Mitarbeiter',
		    name:'employees',
		    width: 150
		},
		branch:
		{
			fieldLabel: 'tät. in Branche',
		    name:'branch',
		    width: 150
		},
		sub_branch:
		{
			fieldLabel: 'Unterbranche',
		    name:'sub_branch',
		    width: 100
		},
		responsible:
		{
			fieldLabel: 'Betreuer',
		    name:'responsible',
		    width: 150
		},
		company2:
		{
			width:200,
		    xtype: 'mirrortextfield',
		    fieldLabel: app.i18n._('Firma 2'), 
		    name:'company2',
		    maxLength: 64
		},
		main_category:
		{
			fieldLabel:  app.i18n._('Hauptkategorie'),
		    context: 'main_category_contact_id',
			xtype: 'sogenericstatefield',
			width:200,
			id:'main_category_contact_id',
            name:'main_category_contact_id',
        	allowBlank:false,
            listeners:{
    			scope:this,
    			change: Tine.Addressbook.Listeners.mainCategoryMirrorChangeListener
			}
    	},
		company_mother:
		{
			fieldLabel: 'Muttergesellschaft',
		    name:'company_mother',
		    width: 150
		},
		cooperation:
		{
			fieldLabel: 'Kooperationspartnerschaft',
		    name:'cooperation',
		    width: 150
		},
		province:
		{
			fieldLabel: 'Bundesland',
		    name:'province',
		    width: 150
		},
		address_source:
		{
			fieldLabel: 'Adressquelle',
		    name:'address_source',
		    width: 150
		},
		letter_salutation:
		{
		   	width:400,
            disabled:false,
            fieldLabel: 'Briefanrede',
            disabledClass: 'x-item-disabled-view',
        	id: 'letter_salutation',
            name: 'letter_salutation'
		},
		sex:
		{
			fieldLabel: 'Geschlecht',
		    disabledClass: 'x-item-disabled-view',
		    id:'contact_sex',
		    name:'sex',
		    width:80,
		    xtype:'combo',
		    store:[['MALE','männlich'],['FEMALE','weiblich'],['NEUTRAL','neutral']],
		    value: 'NEUTRAL',
			mode: 'local',
			displayField: 'name',
		    valueField: 'id',
		    triggerAction: 'all'
		},
		bank_account_number:
		 { columnWidth: 0.45,fieldLabel: 'Kontonummer', id:'bank_account_number', name:'bank_account_number'},
         
	    bank_code:
	    	{ columnWidth: 0.45,fieldLabel: 'BLZ', id:'bank_code', name:'bank_code'},
	    bank_account_name:
	    	{ columnWidth: 0.45,fieldLabel: 'Kontoinhaber', id:'bank_account_name', name:'bank_account_name'},
	    bank_name:
	    {
          	xtype:'combo',
          	columnWidth: 0.45,
        	hideTrigger:true,
        	store:[],
        	fieldLabel: 'Bank',
            id:'bank_name',
            name:'bank_name'
      	},
	    birth_date:
	    {
			width:110,
		    xtype: 'datefield',
		    fieldLabel: 'Geburtsdatum',
		    name: 'bday'
	    },
	    
	    partner_salutation:
	    {
			width:100,
		    fieldLabel: 'Par.Anrede',
		    xtype: 'combo',
		    store: Tine.Addressbook.getSalutationStore(),
		    id: 'partner_salutation_id',
		    name: 'partner_salutation_id',
		    mode: 'local',
		    displayField: 'name',
		    valueField: 'id',
		    triggerAction: 'all',
		    listeners:{
				scope: this,
				'change': Tine.Addressbook.createLetterSalutation.createDelegate(this,[true])
			}
		},
		partner_title:
		{
			xtype: 'combo',
			width:160,
		    fieldLabel: 'Par.Titel', 
		    store:Tine.Addressbook.getSoContactTitleStore(),
		    name:'partner_title',
		    id: 'partner_title',
		    mode: 'local',
		    displayField: 'name',
		    valueField: 'id',
		    triggerAction: 'all',
		    listeners:{
				scope: this,
				'change': Tine.Addressbook.createLetterSalutation.createDelegate(this,[true])
			}
		 },
		 
		 partner_sex:
		 {
			fieldLabel: 'Par.Geschlecht',
		    disabledClass: 'x-item-disabled-view',
		    id:'partner_sex',
		    name:'partner_sex',
		    width:80,
		    xtype:'combo',
		    store:[['MALE','männlich'],['FEMALE','weiblich'],['NEUTRAL','neutral']],
		    value: 'NEUTRAL',
			mode: 'local',
			displayField: 'name',
		    valueField: 'id',
		    triggerAction: 'all'
		},
		partner_birthday:
		{
			width:110,
			 xtype: 'extuxclearabledatefield',
		    fieldLabel: 'Par.Geburtstag',
		    name: 'partner_birthday'
		},
		
		partner_forename:
		{
			width:200,
		    fieldLabel: 'Par.Vorname', 
		    id: 'partner_forename',
		    name:'partner_forename',
		    listeners:{
				scope: this,
				'change': Tine.Addressbook.createLetterSalutation.createDelegate(this,[true])
			}
		}, 
		partner_lastname:
		{
			width:200,
		    fieldLabel: 'Par.Nachname',
		    id: 'partner_lastname',
		    name:'partner_lastname',
		    listeners:{
				scope: this,
				'change': Tine.Addressbook.createLetterSalutation.createDelegate(this,[true])
			}
		    
		}
	    
	    
	};
};


	