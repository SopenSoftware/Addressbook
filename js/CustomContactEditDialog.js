Ext.namespace('Tine.Addressbook');

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
	
	initComponent: function(){
		//this.initActions();
		this.on('load',this.onLoadContact, this);
		this.on('afterrender',this.onAfterRender,this);
		this.initDependentGrids();
		Tine.Addressbook.CustomContactEditDialog.superclass.initComponent.call(this);
	},
	onLoadContact: function(){
		if(!this.record.isNew()){
			
			
			
		}
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
		//this.doLayout();
	},
	getSelectedRecord: function(){
		return this.record;
	},
	getFormItems: function() {
		var fields = Tine.Addressbook.CustomContactFormFields.get(this.app);
		
		var mainPanel =
		{
        	xtype:'panel',
        	region: 'center',
        	frame:true,
        	layout:'border',
        	items:[{
            	xtype:'panel',
            	region: 'center',
            	items:[
            	       {   xtype:'columnform',
            	    	   
            	    	   items:
            	           [[
            	             fields.salutation, fields.title, fields.n_given, fields.n_family
            	           ],[
            	             fields.org_name, fields.company2, fields.country
            	           ],[
               	             fields.street, fields.postal_code, fields.city
               	           ]]                             	
            	       }
            	   ]
        	}]
        };
			
		return mainPanel;
	}
});

/**
 * Addressbook Edit Popup
 */
Tine.Addressbook.ContactQuickEditDialog.openWindow = function (config) {
    var id = (config.record && config.record.id) ? config.record.id : 0;
    var window = Tine.WindowFactory.getWindow({
        width: 600,
        height: 400,
        modal:true,
        name: Tine.Addressbook.ContactEditDialog.prototype.windowNamePrefix + id,
        contentPanelConstructor: 'Tine.Addressbook.ContactQuickEditDialog',
        contentPanelConstructorConfig: config
    });
    return window;
};







Tine.Addressbook.CustomContactEditDialog = Ext.extend(Tine.widgets.dialog.EditDialog, {
	
	/**
	 * @private
	 */
	windowNamePrefix: 'ContactEditWindow_',
	appName: 'Addressbook',
	recordClass: Tine.Addressbook.Model.Contact,
	recordProxy: Tine.Addressbook.contactBackend,
	loadRecord: true,
	evalGrants: false,
	
	initComponent: function(){
		//this.initActions();
		this.on('load',this.onLoadContact, this);
		this.on('afterrender',this.onAfterRender,this);
		this.initDependentGrids();
		Tine.Addressbook.CustomContactEditDialog.superclass.initComponent.call(this);
	},
	onLoadContact: function(){
		if(!this.record.isNew()){
			// enable attendance grid if record has id
			this.contactLeadGrid.enable();
			this.contactLeadGrid.loadForeignRecord(this.record);
			this.contactTaskGrid.enable();
			this.contactTaskGrid.loadForeignRecord(this.record);
			//this.contactCalendarGrid.enable();
			//this.contactCalendarGrid.loadContact(this.record);
			
		}
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
		//this.doLayout();
	},
	getSelectedRecord: function(){
		return this.record;
	},
	initDependentGrids: function(){
		this.contactLeadGrid = new Tine.Crm.GridPanel({
			useForeignFilter:true,
			foreignKey:'account_id',
			header:false,
			layout:'border',
			region:'center',
			disabled:true,
			frame: true,
			app: Tine.Tinebase.appMgr.get('Crm')
		});
		
		
		this.contactTaskGrid = new Tine.Tasks.DependentGridPanel({
			useForeignFilter:true,
			foreignKey:'account_id',
			header:false,
			layout:'border',
			region:'center',
			disabled:true,
			frame: true,
			app: Tine.Tinebase.appMgr.get('Tasks')
		});
		this.contactTaskGrid.initComponent();
		/*this.contactCalendarGrid = new Tine.Addressbook.ContactCalendarGridPanel({
			inDialog:true,
			title:'Termine',
			layout:'border',
			disabled:true,
			frame: true,
			app: Tine.Tinebase.appMgr.get('Addressbook')
		});*/
	},
	getFormItems: function() {
		var fields = Tine.Addressbook.CustomContactFormFields.get(this.app);
		
		var mainPanel =
		{
        	xtype:'panel',
        	region: 'north',
        	frame:true,
        	split:true,
        	collapsible:true,
        	collapseMode:'mini',
        	layout:'border',
        	height:400,
        	items:[{
            	xtype:'panel',
            	region: 'center',
            	//layout:'fit',
            	autoScroll:true,
            	//height:900,
            	items:[
            	       {
            	    	   xtype:'columnform',
            	    	   title:'Kontakt-Stammdaten',
            	    	   width:600,
            	    	   items:
            	           [[
            	             fields.org_name, fields.customer_value, fields.country
            	           ],[
            	             fields.street, fields.postal_code, fields.city
            	             
            	           ]]                             	
            	       },
            	       {xtype:'fieldset',title:'Ansprechpartner',width:600, items:[{
            	    	   //flex:1,
            	    	   xtype:'columnform',
            	    	   
            	    	   items:
            	           [[
            	             fields.salutation, fields.title, fields.n_given, fields.n_family
            	           ],[
            	             fields.phone_ap, fields.mobile_ap, fields.email_ap
            	           ],[
               	             fields.profession, fields.function_category
               	           ],[
               	              fields.hierarchy_level, fields.manager_kind
            	           ]]                             	
            	       }]},
            	       {xtype:'fieldset',title:'Zusatzdaten',width:600,collapsible:true,collapsed:true, items:[{
            	    	   //flex:1,
            	    	   xtype:'columnform',
            	    	   
            	    	   items:
            	           [[
            	             fields.id, fields.revenue, fields.employees, fields.branch, 
            	           ],[
            	             fields.responsible, fields.company2, fields.main_category
            	           ],[
               	             fields.company_mother, fields.cooperation, fields.province
               	          ],[
               	             fields.address_source, fields.so_rid, fields.pe_rid
               	          ],[
               	             fields.buw_state, fields.address_lock
            	           ]]                             	
            	       }]}
            	   ]
        	},{
                // activities and tags
                region: 'east',
                layout: 'accordion',
                animate: true,
                width: 400,
                split: true,
                collapsible: true,
                collapseMode: 'mini',
                header: false,
                margins: '0 5 0 5',
                border: true,
                items: [
                    new Ext.Panel({
                        // @todo generalise!
                        title: this.app.i18n._('Description'),
                        iconCls: 'descriptionIcon',
                        layout: 'form',
                        labelAlign: 'top',
                        border: false,
                        items: [{
                            style: 'margin-top: -4px; border 0px;',
                            labelSeparator: '',
                            xtype:'textarea',
                            name: 'note',
                            hideLabel: true,
                            grow: false,
                            preventScrollbars:false,
                            anchor:'100% 100%',
                            emptyText: this.app.i18n._('Enter description'),
                            requiredGrant: 'editGrant'                           
                        }]
                    }),
                    new Tine.widgets.activities.ActivitiesPanel({
                        app: 'Addressbook',
                        showAddNoteForm: false,
                        border: false,
                        bodyStyle: 'border:1px solid #B5B8C8;'
                    }),
                    new Tine.widgets.tags.TagPanel({
                        app: 'Addressbook',
                        border: false,
                        bodyStyle: 'border:1px solid #B5B8C8;'
                    })
                ]
            }]
        };
		
		//var fields = Tine.Addressbook.CustomContactFormFields.get();
		var contactSouthPanel = new Ext.TabPanel({
	       
			activeTab: 1,
	        id: 'editMainTabPanel',
	        region:'center',
	        layoutOnTabChange:true,  
	        items:[
					{
					   xtype:'panel',
					   layout:'border',
					   title:'Aufgaben',
					   items:
					   [
					    	this.contactTaskGrid
					   ]
					},
	               {
	            	   xtype:'panel',
	            	   layout:'border',
	            	   title:'Leads',
	            	   items:
	            	   [
	            	    	this.contactLeadGrid
	            	   ]
	               }
	               
	              
	        ]
		});
		
		this.wrapper = new Ext.Panel({
			xtype:'panel',
			region: 'center',
			layout:'fit',
			items:
		    [
		     {
		    	 xtype:'panel',
		    	 layout:'fit',
		    	 items:[contactSouthPanel]
		     }
		    
		     
		     	
		    ]
		   
		});
			
		
			var contactPanel = new Ext.Panel(
			
				{
					xtype:'panel',
					layout:'border',
					items:
					[
						
						mainPanel,
						this.wrapper
						
					]

				});
			
		
			
		return contactPanel;
	}
});

/**
 * Addressbook Edit Popup
 */
Tine.Addressbook.CustomContactEditDialog.openWindow = function (config) {
    var id = (config.record && config.record.id) ? config.record.id : 0;
    var window = Tine.WindowFactory.getWindow({
        width: 1020,
        height: 800,
        name: Tine.Addressbook.ContactEditDialog.prototype.windowNamePrefix + id,
        contentPanelConstructor: 'Tine.Addressbook.CustomContactEditDialog',
        contentPanelConstructorConfig: config
    });
    return window;
};

Ext.ns('Tine.Addressbook.ContactForm');

Tine.Addressbook.ContactForm.getColumnForm = function(formFields){
	return {
        xtype: 'panel',
        border: false,
        frame:true,
        items:[{xtype:'columnform',items:
           formFields                               	
        }]
    };
};

Ext.ns('Tine.Addressbook.CustomContactFormFields');

Tine.Addressbook.CustomContactFormFields.get = function(app){
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
				'select': Tine.Addressbook.createLetterSalutation
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
					'change': Tine.Addressbook.createLetterSalutation
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
				'change': Tine.Addressbook.createLetterSalutation
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
				'change': Tine.Addressbook.createLetterSalutation
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
		so_rid:
		{
			fieldLabel: 'SO0_RID',
		    name:'so_rid',
		    width: 150
		},
		pe_rid:
		{
			fieldLabel: 'PE0_RID',
		    name:'pe_rid',
		    width: 150
		},
		buw_state:
		{
			fieldLabel: 'Status buw',
		    name:'buw_state',
		    width: 150
		}
	};
};
	