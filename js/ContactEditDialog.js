/*
 * Tine 2.0
 *
 * @package     Addressbook
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @copyright   Copyright (c) 2009 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id: ContactEditDialog.js 14794 2010-06-04 10:22:16Z f.wiechmann@metaways.de $
 *
 */
Ext.ns('Tine.Addressbook');

Ext.ns('Tine.Addressbook.ContactAdditionalItems');

Tine.Addressbook.ContactAdditionalItems.getMainContactDataAdditionalItems = function(){
	 return [{
   		title:'Partner',
           xtype: 'columnform',
           autoScroll:true,
           forceLayout:true,
           deferredRender:false,
           items: [[
			{
				width:100,
			    fieldLabel: 'Anrede',
			    xtype: 'combo',
			    store: Tine.Addressbook.getSalutationStore(),
			    id: 'partner_salutation_id',
			    name: 'partner_salutation_id',
			    mode: 'local',
			    displayField: 'name',
			    valueField: 'id',
			    triggerAction: 'all'//,
			// [ADAPT HH]: temp, unlocalized, hardcoded extension
			    /*listeners:{
					scope: this,
					'select': Tine.Addressbook.createLetterSalutation
				}*/
			},{
				xtype: 'combo',
				width:160,
			    fieldLabel: 'Titel',
			    store:Tine.Addressbook.getSoContactTitleStore(),
			    name:'partner_title',
			    id: 'partner_title',
			    mode: 'local',
			    displayField: 'name',
			    valueField: 'id',
			    triggerAction: 'all'//,
			    /*listeners:{
					scope: this,
					'change': Tine.Addressbook.createLetterSalutation
				}*/
			 },{
				fieldLabel: 'Geschlecht',
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
			{
				width:110,
				 xtype: 'extuxclearabledatefield',
			    fieldLabel: 'Geburtstag',
			    name: 'partner_birthday'
			}
			], [
			{
				width:200,
			    fieldLabel: 'Vorname',
			    id: 'partner_forename',
			    name:'partner_forename',
			    listeners:{
					scope: this,
					'change': Tine.Addressbook.createLetterSalutation
				}
			}, {
				width:200,
			    fieldLabel: 'Nachname',
			    id: 'partner_lastname',
			    name:'partner_lastname',
			    listeners:{
					scope: this,
					'change': Tine.Addressbook.createLetterSalutation
				}

			}, {
			    width: 80,
			    hidden: true
			}

   ]]},
   {
  	 	title:'Erweitert',
          xtype: 'columnform',
          autoScroll:true,
          items: [[
			{
				width:200,
			    fieldLabel: 'Bundesland',
			    id: 'province',
			    name:'province'
			},{
				width:200,
			    fieldLabel: 'Regierungsbezirk',
			    id: 'district',
			    name:'district'
			}
		],[
			{
				width:200,
			    fieldLabel: 'Kreis',
			    id: 'county',
			    name:'county'
			},{
				width:200,
			    fieldLabel: 'Gemeinde',
			    id: 'community',
			    name:'community'
			}
		],[
			{
				width:200,
			    fieldLabel: 'Gemeindeschlüssel',
			    id: 'community_key',
			    name:'community_key'
			},{
				width:200,
			    fieldLabel: 'Kulturraum',
			    id: 'cultural_area',
			    name:'cultural_area'
			}

          ]]
   }]
   ;
};

/**
 * @namespace   Tine.Addressbook
 * @class       Tine.Addressbook.ContactEditDialog
 * @extends     Tine.widgets.dialog.EditDialog
 * Addressbook Edit Dialog <br>
 *
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @version     $Id: ContactEditDialog.js 14794 2010-06-04 10:22:16Z f.wiechmann@metaways.de $
 */
Tine.Addressbook.ContactEditDialog = Ext.extend(Tine.widgets.dialog.EditDialog, {

    windowNamePrefix: 'ContactEditWindow_',
    appName: 'Addressbook',
    recordClass: Tine.Addressbook.Model.Contact,
    recordProxy: Tine.Addressbook.contactBackend,
    showContainerSelector: true,
    loadRecord:false,
    bufferApplyParams: null,
    ddConfig:{
    	ddGroupContact: 'ddGroupContact',
    	ddGroupGetContact: 'ddGroupGetContact'
    },
    /**
     * init component
     */
    initComponent: function() {
    	this.bankDataHelpers = new Ext.util.MixedCollection();

	    this.addEvents(
	            /**
	             * @event loadcontact
	             * fired when a contact is loaded
	             * @param {Tine.Addressbook.Model.Contact} contactRecord
	             */
	            'loadcontact',
	            /**
	             * @event savecontact
	             * fired when a contact is saved
	             * @param {Tine.Addressbook.Model.Contact} contactRecord
	             */
	            'savecontact',
	            /**
	             * @event updatecontact
	             * fired when a contact is updated
	             * @param {Tine.Addressbook.Model.Contact} contactRecord
	             */
	            'updatecontact',
	            /**
	             * @event provideduplicates
	             * fired when a contact is tried to get created, but found duplicates (more than one!)
	             * -> reaction could be to filter grid for the given duplicate ids for selection
	             * @param {array of strings} contact duplicate ids
	             */
	            'provideduplicates'
	    );

	    this.initDependentGrids();

	    this.crmPanel = Tine.Addressbook.getContactCRMPanel();
	    this.crmPanel.on('afterrender',this.loadIt, this);

        this.linkPanel = new Tine.widgets.dialog.LinkPanel({
            relatedRecords: {
                Crm_Model_Lead: {
                    recordClass: Tine.Crm.Model.Lead,
                    dlgOpener: Tine.Crm.LeadEditDialog.openWindow
                }
            }
        });

        // export lead handler for edit contact dialog
        var exportContactButton = new Ext.Action({
            id: 'exportButton',
            text: Tine.Tinebase.appMgr.get('Addressbook').i18n._('Export as pdf'),
            handler: this.onExportContact,
            iconCls: 'action_exportAsPdf',
            disabled: false,
            scope: this
        });
        var addNewContactButton = new Ext.Action({
            id: 'addNewContactButton',
            text: Tine.Tinebase.appMgr.get('Addressbook').i18n._('Neuen Kontakt'),
            handler: this.onAddNewContact,
            iconCls: 'actionAdd',
            tooltip: 'Neuen Kontakt anlegen. Leert den aktuellen Dialog und ermöglicht die Eingabe eines neuen Kontaktes. Der zuvor aktuelle Kontakt bleibt davon unberührt.',
            disabled: false,
            scope: this
        });

        this.checkDuplicatesButton = new Ext.Action({
            text: 'Duplikate suchen',
            handler: this.checkDuplicateRecords,
            scope: this
        });

        this.previewAddressLabelOneButton = new Ext.Action({
            text: 'Adresse 1',
            handler: this.previewAddressLabel.createDelegate(this,[1]),
            scope: this
        });

        this.previewAddressLabelTwoButton = new Ext.Action({
            text: 'Adresse 2',
            handler: this.previewAddressLabel.createDelegate(this,[2]),
            scope: this
        });

        this.previewAddressLabelThreeButton = new Ext.Action({
            text: 'Adresse 3',
            handler: this.previewAddressLabel.createDelegate(this,[3]),
            scope: this
        });

        this.previewAddressLabelFourButton = new Ext.Action({
            text: 'Adresse 4',
            handler: this.previewAddressLabel.createDelegate(this,[4]),
            scope: this
        });

        var previewAddressLabelButton = new Ext.Action({
            id: 'previewAddressLabelButton',
            text: Tine.Tinebase.appMgr.get('Addressbook').i18n._('Vorschau Adressetikett'),
            handler: this.onAddNewContact,
            iconCls: 'action_previewAddressLabel',
            tooltip: 'Hiermit kann für die einzelnen Adressen eine Vorschau für ein Adressetikett erstellt, bearbeitet, und bei Bedarf fixiert werden',
            disabled: false,
            menu:{
             	items:[
             	      this.previewAddressLabelOneButton ,
             	      this.previewAddressLabelTwoButton ,
             	      this.previewAddressLabelThreeButton,
             	      this.previewAddressLabelFourButton
             	]
             }
        });

        var addNoteButton = new Tine.widgets.activities.ActivitiesAddButton({});
        this.tbarItems =
        [
         	exportContactButton,
         	addNoteButton,
         	addNewContactButton,
         	previewAddressLabelButton,
         	this.checkDuplicatesButton
         ];

        this.on('load',this.onLoadContact, this);
        this.on('afterrender',this.onAfterRender,this);

        Tine.Addressbook.ContactEditDialog.superclass.initComponent.call(this);
        //this.supr().initComponent.apply(this, arguments);
    },
    initDependentGrids: function(){
    	this.duplicateCheckWidget = new Tine.Addressbook.DuplicateCheckWidget({
    		collapseFirst:true,
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


		this.contactPersonGrid = new Tine.Addressbook.ContactPersonGridPanel({
			inDialog:true,
			contactDialog:this,
			title:'Ansprechpartner',
			layout:'border',
			disabled:true,
			frame: true,
			app: Tine.Tinebase.appMgr.get('Addressbook')
		});
    },
    onDuplicatesFound: function(count, ids, duplicateWidget){
    	//this.getContactMainDataPanel().add(this.duplicateCheckWidget);
    	this.duplicateCheckWidget.expand();
    },
    onNoDuplicatesFound: function(count, ids, duplicateWidget){
    	//this.getContactMainDataPanel().remove(this.duplicateCheckWidget);
    	this.duplicateCheckWidget.collapse();
    },
    onDuplicateCheckFailed: function(duplicateWidget){
    	//this.getContactMainDataPanel().remove(this.duplicateCheckWidget);
    	this.duplicateCheckWidget.collapse();
    },
    onLoadContact: function(){
    	if(!this.record.isNew()){
			this.contactPersonGrid.enable();
			this.contactPersonGrid.loadContact(this.record);
			this.checkLabels();

			this.bankDataHelpers.each(
				function(item){
					item.updateFromForm();
				},
				this
			);
			this.getSCrmPanel().enable();
			this.getSCrmFieldSet().expand();
			this.getSCrmPanel().setRecordPopulator(this);

		}else{
			this.getSCrmPanel().setRecordPopulator(this);
			this.getSCrmPanel().disable();
			this.getSCrmFieldSet().collapse();
			this.contactPersonGrid.disable();
			this.contactPersonGrid.loadContact(this.record);
		}
    },
    getSCrmPanel: function(){
    	return Ext.getCmp('contact_record_scrm_panel');
    },
    getSCrmFieldSet: function(){
    	return Ext.getCmp('contact_record_scrm_fieldset');
    },
    loadIt: function(){
    	if(!this.crmPanel.rendered){
    		this.loadIt.defer(250, this);
    		return true;
    	}
    	this.lazyLoad.defer(500, this);
    },
    lazyLoad: function(){
    	this.getForm().loadRecord(this.record);
    },
    initButtons: function(){
    	//this.tbarItems = genericButtons.concat(this.tbarItems);
    	Tine.Addressbook.ContactEditDialog.superclass.initButtons.call(this);
        this.fbar = [
             '->',
             this.action_applyChanges,
             this.action_cancel,
             this.action_saveAndClose
        ];
    },
    onAddNewContact: function(){

    	this.record = new Tine.Addressbook.Model.Contact(Tine.Addressbook.Model.Contact.getDefaultData(),0);
        this.recordProxy = new Tine.Tinebase.data.RecordProxy({
            recordClass: this.recordClass
        });
        this.getForm().reset();
        Ext.getCmp('main_category_contact_id_mirror').setValue(0);
        this.initRecord();
    },
    previewAddressLabel: function(addressNumber){
    	this.addressNumberBuffer = addressNumber;
    	Ext.Ajax.request({
            scope: this,
            success: this.onGenerateAddressLabel,
            params: {
                method: 'Addressbook.previewAddressLabel',
               	contactId:  this.record.get('id'),
               	addressNumber: addressNumber
            },
            failure: this.onGenerateAddressLabelFailed
        });
    },
    fixAddressLabel: function(){
    	var prefix;

    	switch(this.addressNumberBuffer){

    	case 1:
    		prefix = 'adr_one_';
    		break;
    	case 2:
    		prefix = 'adr_two_';
    		break;
    	case 3:
    		prefix = 'adr3_';
    		break;
    	case 4:
    		prefix = 'adr4_';
    		break;
    	}

    	this.record.set(prefix + 'label', this.labelTextArea.getValue());
    	Ext.getCmp(prefix + 'label_field').setValue(this.labelTextArea.getValue());
    	this.checkLabels();
    	//this.onRecordUpdate();
    },

    checkLabels: function(){
    	try{
    	this.checkLabel('adr_one_');
    	this.checkLabel('adr_two_');
    	this.checkLabel('adr3_');
    	this.checkLabel('adr4_');
    	}catch(e){
    		// @todo: check silent failure ok?
    	}
    },
    checkLabel: function(labelPrefix){
    	if(this.record.get(labelPrefix + 'label') != ''){
    		Ext.getCmp(labelPrefix + 'label_component').expand();
    	}else{
    		Ext.getCmp(labelPrefix + 'label_component').collapse();
    	}
    },
    onGenerateAddressLabel: function(response){
    	var result = Ext.util.JSON.decode(response.responseText);

		if(result.success==true){
			this.labelTextArea = new Ext.form.TextArea({
                	value: result.result
			});
			  var win = new Ext.Window({
				  parentScope:this,
	              title: 'Adress-Etikett: Adresse ' + this.addressNumberBuffer,
				  layout:'fit',
	                width:300,
	                height:180,
	                closeAction:'hide',
	                plain: true,

	                items: this.labelTextArea,

	                buttons: [{
	                    text:'Fixieren',
	                    handler: function(){
	                        win.parentScope.fixAddressLabel();
	                    }
	                },{
	                    text: 'Ok',
	                    handler: function(){
	                        win.hide();
	                    }
	                }]
	            });

	        win.show(this);
		}else{
			this.onGenerateAddressLabelFailed();
		}
	},
	onGenerateAddressLabelFailed: function(){
		Ext.MessageBox.show({
            title: 'Fehler',
            msg: 'Die Vorschau des Adress-Etiketts konnte aufgrund eines Fehlers nicht erstellt werden.',
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.WARNING
        });
	},
    loadRecordById: function(id){
    	this.record = new Tine.Addressbook.Model.Contact({id:id},id);
    	this.initRecord();
    },
    onRecordLoad: function() {
        // NOTE: it comes again and again till
        if (this.rendered) {
        	this.onLockSelect(this.getLockSelect());

            // handle default container
            if (! this.record.id) {
                if (this.forceContainer) {
                    var container = this.forceContainer;
                    // only force initially!
                    this.forceContainer = null;
                } else {
                    var container = Tine.Addressbook.registry.get('defaultAddressbook');
                }

                this.record.set('container_id', '');
                this.record.set('container_id', container);
            }

            if (Tine.Tinebase.registry.get('mapPanel') && Tine.widgets.MapPanel && this.record.get('lon') && this.record.get('lon') !== null && this.record.get('lat') && this.record.get('lat') !== null) {
                this.mapPanel.setCenter(this.record.get('lon'),this.record.get('lat'));
            }
            this.setDraweeUsage(this.record);

            /// TODO HH: remove hack
            // refresh activities panel
            this.activitiesPanel.record_id = this.record.id;
            this.activitiesPanel.store.load();
        }

        Tine.Addressbook.ContactEditDialog.superclass.onRecordLoad.call(this,this.record);
        this.fireEvent('loadcontact',this.record);
        //this.supr().onRecordLoad.apply(this, arguments);
        this.linkPanel.onRecordLoad(this.record);
    },
    onApplyChanges: function(button, event, closeWindow) {

    	//this.record.set('jpegphoto', Ext.getCmp('addressbookeditdialog-jpegimage').getValue());
        this.record.set('busy_is_letter_address', Ext.getCmp('busy_letter').checked);
        this.record.set('busy_is_shipping_address', Ext.getCmp('busy_shipping').checked);
        this.record.set('busy_is_invoice_address', Ext.getCmp('busy_invoice').checked);

        this.record.set('adr3_is_letter_address', Ext.getCmp('adr3_letter').checked);
        this.record.set('adr3_is_shipping_address', Ext.getCmp('adr3_shipping').checked);
        this.record.set('adr3_is_invoice_address', Ext.getCmp('adr3_invoice').checked);

        this.record.set('adr4_is_letter_address', Ext.getCmp('adr4_letter').checked);
        this.record.set('adr4_is_shipping_address', Ext.getCmp('adr4_shipping').checked);
        this.record.set('adr4_is_invoice_address', Ext.getCmp('adr4_invoice').checked);

        this.record.set('is_manual_salutation', Ext.getCmp('manual_salutation').checked);
        this.record.set('is_manual_form', Ext.getCmp('manual_form').checked);

        this.finalizeApply(button, event, closeWindow);

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
	/*onCheckDuplicateContact: function(response){
		var result = Ext.util.JSON.decode(response.responseText);
		this.bufferIntermediateApply.result = result;
		var check;
		if(result.success == true && result.check == false){
			this.finalizeApply(this.bufferIntermediateApply.params.button, this.bufferIntermediateApply.params.event, this.bufferIntermediateApply.params.closeWindow);
		}else{
			 Ext.MessageBox.show({
	             title: 'Kontakt bereits vorhanden',
	             msg: 'Der Kontakt scheint bereits ' + result.count + ' mal vorhanden zu sein.<br />Soll er dennoch neu erfasst werden?',
	             buttons: Ext.Msg.YESNO,
	             scope: this,
	             fn: this.onAnswerDuplicateQuestion,
	             icon: Ext.MessageBox.QUESTION
	         });
		}
	},*/
	onAnswerDuplicateQuestion: function(btn, text){
		if(btn == 'yes'){
			this.duplicateCheckWidget.collapse();
			this.finalizeApply(this.bufferIntermediateApply.params.button, this.bufferIntermediateApply.params.event, this.bufferIntermediateApply.params.closeWindow);
		}else{
			/*if(this.bufferIntermediateApply.result.count>1){
				this.fireEvent('provideduplicates', this.bufferIntermediateApply.result.duplicateIds)
			}else{
				this.loadRecordById(this.bufferIntermediateApply.result.duplicateIds[0]);
			}*/
		}
	},
    finalizeApply: function(button, event, closeWindow){
    	Tine.Addressbook.ContactEditDialog.superclass.onApplyChanges.call(this,button, event, closeWindow);
    },
    setDraweeUsage: function(contact){
    	// default case: empty record busy address shall be default for all use cases
    	try{
	    	if(contact.get('busy_is_letter_address') === undefined){
	        	Ext.getCmp('adr3_invoice').setValue(false);
	        	Ext.getCmp('busy_invoice').setValue(true);
	        	Ext.getCmp('private_invoice').setValue(false);

	        	Ext.getCmp('adr3_letter').setValue(false);
	        	Ext.getCmp('busy_letter').setValue(true);
	        	Ext.getCmp('private_letter').setValue(false);

	        	Ext.getCmp('adr3_shipping').setValue(false);
	        	Ext.getCmp('busy_shipping').setValue(true);
	        	Ext.getCmp('private_shipping').setValue(false);

	        	Ext.getCmp('adr4_invoice').setValue(false);
	        	Ext.getCmp('adr4_letter').setValue(false);
	        	Ext.getCmp('adr4_shipping').setValue(false);

	        	return;
	    	}

	    	if(contact.get('busy_is_letter_address')!='0'){
	        	Ext.getCmp('busy_letter').setValue(true);
	        	Ext.getCmp('private_letter').setValue(false);
	        }else{
	        	Ext.getCmp('busy_letter').setValue(false);
	        	Ext.getCmp('private_letter').setValue(true);
	        }
	        if(contact.get('busy_is_shipping_address')!='0'){
	        	Ext.getCmp('busy_shipping').setValue(true);
	        	Ext.getCmp('private_shipping').setValue(false);
	        }else{
	        	Ext.getCmp('busy_shipping').setValue(false);
	        	Ext.getCmp('private_shipping').setValue(true);
	        }
	        if(contact.get('busy_is_invoice_address')!='0'){
	        	Ext.getCmp('busy_invoice').setValue(true);
	        	Ext.getCmp('private_invoice').setValue(false);
	        }else{
	        	Ext.getCmp('busy_invoice').setValue(false);
	        	Ext.getCmp('private_invoice').setValue(true);
	        }

	        if(contact.get('adr3_is_invoice_address')!='0'){
	        	Ext.getCmp('adr3_invoice').setValue(true);
	        	Ext.getCmp('adr4_invoice').setValue(false);
	        	Ext.getCmp('busy_invoice').setValue(false);
	        	Ext.getCmp('private_invoice').setValue(false);
	        }
	        if(contact.get('adr3_is_letter_address')!='0'){
	        	Ext.getCmp('adr3_letter').setValue(true);
	        	Ext.getCmp('adr4_letter').setValue(false);
	        	Ext.getCmp('busy_letter').setValue(false);
	        	Ext.getCmp('private_letter').setValue(false);
	        }
	        if(contact.get('adr3_is_shipping_address')!='0'){
	        	Ext.getCmp('adr3_shipping').setValue(true);
	        	Ext.getCmp('adr4_shipping').setValue(false);
	        	Ext.getCmp('busy_shipping').setValue(false);
	        	Ext.getCmp('private_shipping').setValue(false);
	        }

	        if(contact.get('adr4_is_invoice_address')!='0'){
	        	Ext.getCmp('adr4_invoice').setValue(true);
	        	Ext.getCmp('adr3_invoice').setValue(false);
	        	Ext.getCmp('busy_invoice').setValue(false);
	        	Ext.getCmp('private_invoice').setValue(false);
	        }
	        if(contact.get('adr4_is_letter_address')!='0'){
	        	Ext.getCmp('adr4_letter').setValue(true);
	        	Ext.getCmp('adr3_letter').setValue(false);
	        	Ext.getCmp('busy_letter').setValue(false);
	        	Ext.getCmp('private_letter').setValue(false);
	        }
	        if(contact.get('adr4_is_shipping_address')!='0'){
	        	Ext.getCmp('adr4_shipping').setValue(true);
	        	Ext.getCmp('adr3_shipping').setValue(false);
	        	Ext.getCmp('busy_shipping').setValue(false);
	        	Ext.getCmp('private_shipping').setValue(false);
	        }

	        Ext.getCmp('manual_salutation').setValue(contact.get('is_manual_salutation'));
        	Ext.getCmp('manual_form').setValue(contact.get('is_manual_form'));
    	}catch(e){
    		// IE craziness: empty catch ok
    	}
    },

    onRecordUpdate: function(){
    	Tine.Addressbook.ContactEditDialog.superclass.onRecordUpdate.call(this);
    	this.fireEvent('updatecontact',this.record);
    },
    onCheckSalutation: function(el, checked){
    	if(checked){
    		Ext.getCmp('letter_salutation').disable();
    	}else{
    		Ext.getCmp('letter_salutation').enable();
    	}
    },

    onCheckFormToAddress: function(el, checked){
    	if(checked){
    		Ext.getCmp('form_of_address').disable();
    	}else{
    		Ext.getCmp('form_of_address').enable();
    	}
    },
    getLockSelect: function(){
    	return Ext.getCmp('contact_is_locked');
    },
    getLockExpander: function(){
		return Ext.getCmp('lockAddition');
	},
	getLockDate: function(){
		return Ext.getCmp('contact_lock_date');
	},
	getLockComment: function(){
		return Ext.getCmp('contact_lock_comment');
	},
	onLockSelect: function( select ){
		var value = select.getValue();

		switch(value){
		case true:
				this.getLockExpander().expand();
				this.getLockDate().enable();
				this.getLockComment().enable();
			break;

		case false:
			this.getLockExpander().collapse();
			this.getLockDate().disable();
			this.getLockDate().setValue(null);
			this.getLockComment().disable();
			this.getLockComment.value = null;
			break;
		}
	},
	getContactMainDataPanel: function(){
		return Ext.getCmp('contact-main-data-center-panel');
	},
    // -->
	getFormItems: function() {


	 	var lockForm =
		{
			xtype:'columnform',border:false,width:450, items:
			[[
				{
					xtype: 'extuxclearabledatefield',
					disabledClass: 'x-item-disabled-view',
					id: 'contact_lock_date',
					name: 'lock_date',
					fieldLabel: 'Sperre ab',
				    columnWidth:0.4,
				    disabled:true
				}
			],[
				{
					xtype: 'textarea',
					fieldLabel: 'Bemerkung zur Sperre',
					disabledClass: 'x-item-disabled-view',
					id:'contact_lock_comment',
					name:'lock_comment',
					width: 450,
					height: 30,
					disabled:true
				}
			]]
		};


        var salutationTBar = new Ext.Toolbar({height: 26});
        salutationTBar.add(new Ext.form.Checkbox({
        	boxLabel:'Briefanrede fixiert',
        	id: 'manual_salutation',
        	listeners:{
        	check: {
        		scope:this,
        		fn: this.onCheckSalutation
        	}
        }}));

        var formOfAddressTBar = new Ext.Toolbar({height: 26});
        formOfAddressTBar.add(new Ext.form.Checkbox({boxLabel:'Adressanrede fixiert',
        	checked: false,
        	id: 'manual_form',
        	listeners:{
        	check: {
        		scope:this,
        		fn: this.onCheckFormToAddress
        	}
        }}));


        if (Tine.Tinebase.registry.get('mapPanel') && Tine.widgets.MapPanel) {
            this.mapPanel = new Tine.widgets.MapPanel({
                layout: 'fit',
                title: this.app.i18n._('Map'),
                disabled: (! this.record.get('lon') || this.record.get('lon') === null) && (! this.record.get('lat') || this.record.get('lat') === null),
                zoom: 15
            });
        } else {
            this.mapPanel = new Ext.Panel({
                layout: 'fit',
                title: this.app.i18n._('Map'),
                disabled: true,
                html: ''
            });
        }


        var mainContactDataColumnForm = {
        		title:'Hauptkontakt',
                xtype: 'columnform',
                autoScroll:true,
                forceLayout:true,
                deferredRender:false,
                items: [[
			{
				width:100,
			    fieldLabel: this.app.i18n._('Salutation'),
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
			new Ext.ux.form.ClearableComboBox({
				width:120,
			    fieldLabel: this.app.i18n._('Title'),
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
			}),{
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
			{
				width:110,
			    xtype: 'extuxclearabledatefield',
			    fieldLabel: this.app.i18n._('Birthday'),
			    id:'bday',
			    name: 'bday',
			    listeners:{
					scope:this,
					change: Tine.Addressbook.Listeners.birthdayFieldChangeListener
				}
			}
			], [
			{
				width:200,
			    fieldLabel: this.app.i18n._('First Name'),
			    id: 'first_name_id',
			    name:'n_given',
			    listeners:{
					scope: this,
					'change': Tine.Addressbook.createLetterSalutation
				}
			}, {
				width:200,
			    fieldLabel: this.app.i18n._('Last Name'),
			    id: 'last_name_id',
			    name:'n_family',
			    listeners:{
					scope: this,
					'change': Tine.Addressbook.createLetterSalutation
				}

			}, {
			    width: 80,
			    hidden: true
			}
			], [
			{
				width:200,
			    xtype: 'mirrortextfield',
			    fieldLabel: this.app.i18n._('Company'),
			    name:'org_name',
			    maxLength: 64
			},
			{
				width:200,
			    fieldLabel: this.app.i18n._('Job Title'),
			    name: 'title'
			},
			{
			    width: 80,
			    hidden: true
			}
			], [
				{
					width:400,
				    xtype: 'mirrortextfield',
				    fieldLabel: this.app.i18n._('Firma 2'),
				    name:'company2',
				    maxLength: 64
				},
				{
				    width: 80,
				    hidden:true
				}
			], [
			{
				width:200,
			    xtype: 'mirrortextfield',
			    fieldLabel: this.app.i18n._('Firma 3'),
			    name:'company3',
			    maxLength: 64
			},
			{
				width:200,
			    fieldLabel: this.app.i18n._('Unit'),
			    name:'org_unit',
			    maxLength: 64
			},
			{
			    width: 80,
			    hidden:true
			}
			], [
			{
			    width:200,
			    xtype: 'textfield',
			    fieldLabel: this.app.i18n._('Nationalität'),
			    name:'nationality',
			    maxLength: 64
			},
			{
			    width:200,
			    fieldLabel: this.app.i18n._('Amtstitel'),
			    name:'official_title',
			    maxLength: 64
			},
			{
			    width: 80,
			    hidden:true
			}


        ]]};

        var mainContactDataColumnFormItems =
        [
         	mainContactDataColumnForm,
         	this.contactPersonGrid
        ];

        // try to fetch additional data items for contact
        // really dirty customizing, but sometimes due
        // to time restrictions the one and only solution!! sorry!
        try{
	        if(typeof(Tine.Addressbook.ContactAdditionalItems.getMainContactDataAdditionalItems)==='function'){
	        	var a = Tine.Addressbook.ContactAdditionalItems.getMainContactDataAdditionalItems();
	        	mainContactDataColumnFormItems = mainContactDataColumnFormItems.concat(a);
	        }
        }catch(e){
        	console.log(e);
        }



        var mainContactDataTabPanel = {
        	 xtype:'tabpanel',
        	 region: 'center',
             border: false,
             //deferredRender:false,
             layoutOnTabChange:true,
             width:500,
             height: 250,
             split: true,
             activeTab: 0,
             defaults: {
                 frame: true
             },
             items: mainContactDataColumnFormItems
        };


        var contactTabPanel = new Ext.TabPanel({
            border: false,
            plain:true,
            activeTab: 0,
            layoutOnTabChange:true,
            forceLayout:true,
            items:[{
                title: this.app.i18n.n_('Contact', 'Contacts', 1),
                id:'contact-main-data-center-panel',
                border: false,
                frame: true,
                layout: 'border',
                items: [
                        {
                    region: 'center',
                    layout: 'border',
                    autoScroll:true,
                    items: [
                            this.duplicateCheckWidget,
                            {
                        xtype: 'fieldset',
                        region: 'center',
                        autoHeight: true,
                        title: this.app.i18n._('Personal Information'),
                        items: [{xtype:'hidden', name:'jpegphoto'},
                                /*{
                            xtype: 'panel',
                            layout: 'fit',
                            style: {
                                position: 'absolute',
                                width: '90px',
                                height: '120px',
                                right: '14px',
                                top: Ext.isGecko ? '62px' : '74px',
                                'z-index': 100
                            },
                            items: [new Ext.ux.form.ImageField({
                                name: 'jpegphoto',
                                width: 90,
                                height: 120
                            })]
                        }, */{
                            xtype: 'columnform',
                            items: [/*[

                                     	this.duplicateCheckWidget
                                ],*/[
									{
										xtype:'checkbox',
										hideLabel: true,
										boxLabel: 'Sperre liegt vor',
									    id:'contact_is_locked',
									    name:'is_locked',
									    width: 100
									},{
										xtype:'checkbox',
										hideLabel: true,
										boxLabel: 'Person führend',
									    id:'contact_person_leading',
									    name:'person_leading',
									    width: 100
									},{
										xtype:'checkbox',
										hideLabel: true,
										boxLabel: 'Du-Anrede',
									    id:'contact_you_salutation',
									    name:'you_salutation',
									    width: 100
									}
                                 ],[
                                    {
                            	    	xtype: 'panel',
                            	    	id:'lockAddition',
                            	    	layout:'fit',
                            	    	header:false,
                            	    	width:450,
                            	    	collapsible:true,
                            	    	collapsed:true,
                            	    	items:[
                            	    	       lockForm
                            	    	]
                            	    }
                                 ],[
            						{
            						    columnWidth: 0.15,
            						    fieldLabel: this.app.i18n._('Addressnummer'),
            						    id:'contact_id',
            						    name:'id',
            						    disabled:true
            						},{
            						    columnWidth: 0.2,
            						    fieldLabel: this.app.i18n._('Kreditor-Nr'),
            						    id:'creditor_ext_id',
            						    name:'creditor_ext_id'
            						},{
            					    	xtype:'processtriggerfield',
            					    	fieldLabel: this.app.i18n._('Debitor-Nr'),
            						    id:'debitor_ext_id',
            						    name:'debitor_ext_id',
            					    	disabledClass: 'x-item-disabled-view',
            					    	blurOnSelect: true,
            					 	    columnWidth: 0.2,
	            					 	listeners:{
	            					 	   scope:this,
	            					 	   triggerclick: Tine.Addressbook.Listeners.debitorNumberChangeListener,
	            					 	   valid: Tine.Addressbook.Listeners.debitorNumberValidateListener
	           							}
            						},{
            							fieldLabel:  this.app.i18n._('Hauptkategorie'),
            						    context: 'main_category_contact_id',
            							xtype: 'sogenericstatefield',
            							columnWidth: 0.3,
            							id:'main_category_contact_id',
            				            name:'main_category_contact_id',
            			            	allowBlank:false,
            	                        listeners:{
            			        			scope:this,
            			        			change: Tine.Addressbook.Listeners.mainCategoryMirrorChangeListener
            							}
            			        	}, {
                                        width: 100,
                                        hidden: true
                                        //type: 'panel',
                                        //layout: 'fit',
                                        //items:
                                    }
            					],[
mainContactDataTabPanel
                                ],[

                                   {
                                	   xtype: 'fieldset',
                                	   collapsible:true,
                                	   width:500,
                                	   height:120,
                                	   collapsed:true,
                                	   title: 'Briefanrede/Adressanrede',
                                	   items:[
										{
											xtype:'columnform',border:false,width:500, items:
											[[
												{
													xtype: 'panel',
													width:500,
													height:60,
													layout:'fit',
													tbar: formOfAddressTBar,
													items:[
													       {
													    	width:480,
												            height:30,
												            disabledClass: 'x-item-disabled-view',
												        	xtype:'textarea',
												            hideLabel:true,
												            disabled:false,
												            id: 'form_of_address',
					               	                        name: 'form_of_address'
													       }
													]
												}
											],[
												{
			            	                   		xtype: 'panel',
			            	                   		width:500,
			            	                   		height:60,
			            	                   		layout:'fit',
			            	                   		tbar: salutationTBar,
			            	                   		items:[
			            	                   		       {
			            	                   		    	width:480,
			                    	                        height:30,
			                    	                        xtype:'textarea',
			                    	                        hideLabel:true,
			                    	                        disabled:false,
			                    	                        disabledClass: 'x-item-disabled-view',
			                    	                    	id: 'letter_salutation',
			                    	                        name: 'letter_salutation'
			            	                   		       }
			            	                   		]

			            	                    }
											]]
										}
                                	   ]
                                   }
                            ]]
                        }, {
                            xtype: 'tabpanel',
                            region: 'center',
                            border: false,
                            deferredRender:false,
                            height: 80,
                            split: true,
                            activeTab: 0,
                            defaults: {
                                frame: true
                            },
                            items:[
								{
								    xtype: 'columnform',
								    title: 'Telefon',
									labelAlign: 'top',
									formDefaults: {
									    xtype:'icontextfield',
									    anchor: '99%',
									    labelSeparator: ''
									},
									defaults:{
										 	columnWidth: 0.9
									},
									items: [
									    [
									     	{
									     		fieldLabel: this.app.i18n._('Phone'),
									            labelIcon: 'images/oxygen/16x16/apps/kcall.png',
									            name:'tel_work'
									        },{
									     		fieldLabel: this.app.i18n._('Phone (private)'),
									            labelIcon: 'images/oxygen/16x16/apps/kcall.png',
									            name:'tel_home'
									        },{
									     		fieldLabel: this.app.i18n._('Phone') + ' 3',
									            labelIcon: 'images/oxygen/16x16/apps/kcall.png',
									            name:'tel3'
									        },{
									     		fieldLabel: this.app.i18n._('Phone') + ' 4',
									            labelIcon: 'images/oxygen/16x16/apps/kcall.png',
									            name:'tel4'
									        }
									     	]
									    ]
								},{
								    xtype: 'columnform',
								    title: 'Fax',
									labelAlign: 'top',
									formDefaults: {
									    xtype:'icontextfield',
									    anchor: '99%',
									    labelSeparator: ''
									},
									defaults:{
										columnWidth: 0.25
									},
									items: [
									    [
									    {
            					        	fieldLabel: this.app.i18n._('Fax'),
            					            labelIcon: 'images/oxygen/16x16/devices/printer.png',
            					            name:'tel_fax'
            					        },{
            					        	fieldLabel: this.app.i18n._('Fax (private)'),
            					            labelIcon: 'images/oxygen/16x16/devices/printer.png',
            					            name:'tel_fax_home'
            					        },{
            					        	fieldLabel: this.app.i18n._('Fax') + ' 3',
            					            labelIcon: 'images/oxygen/16x16/devices/printer.png',
            					            name:'tel_fax3'
            					        },{
            					        	fieldLabel: this.app.i18n._('Fax') + ' 4',
            					            labelIcon: 'images/oxygen/16x16/devices/printer.png',
            					            name:'tel_fax4'
            					        }
									     	]
									    ]
								},{
								    xtype: 'columnform',
								    title: 'Mobil',
									labelAlign: 'top',
									formDefaults: {
									    xtype:'icontextfield',
									    anchor: '99%',
									    labelSeparator: ''
									},
									defaults:{
										columnWidth: 0.25
									},
									items: [[
									      {
              					        	fieldLabel: this.app.i18n._('Mobile'),
              					            labelIcon: 'images/oxygen/16x16/devices/phone.png',
              					            name:'tel_cell_private'
									      },{
              					        	fieldLabel: this.app.i18n._('Mobile (private)'),
              					            labelIcon: 'images/oxygen/16x16/devices/phone.png',
              					            name:'tel_cell'
									      },{
              					        	fieldLabel: this.app.i18n._('Mobile') + ' 3',
              					            labelIcon: 'images/oxygen/16x16/devices/phone.png',
              					            name:'tel_cell3'
									      },{
              					        	fieldLabel: this.app.i18n._('Mobile') + ' 4',
              					            labelIcon: 'images/oxygen/16x16/devices/phone.png',
              					            name:'tel_cell4'
									      }

									     	]
									    ]
								},{
								    xtype: 'columnform',
								    title: 'Email',
									labelAlign: 'top',
									formDefaults: {
									    xtype:'icontextfield',
									    anchor: '99%',
									    labelSeparator: ''
									},
									defaults:{
										columnWidth: 0.25
									},
									items: [[
									         {
	            					            fieldLabel: this.app.i18n._('E-Mail'),
	            					            labelIcon: 'images/oxygen/16x16/actions/kontact-mail.png',
	            					            name:'email',
	            					            vtype: 'email'
	            					        },{
	            					            fieldLabel: this.app.i18n._('E-Mail (private)'),
	            					            labelIcon: 'images/oxygen/16x16/actions/kontact-mail.png',
	            					            name:'email_home',
	            					            vtype: 'email'
	            					        },{
	            					            fieldLabel: this.app.i18n._('E-Mail') + ' 3',
	            					            labelIcon: 'images/oxygen/16x16/actions/kontact-mail.png',
	            					            name:'email3',
	            					            vtype: 'email'
	            					        },{
	            					            fieldLabel: this.app.i18n._('E-Mail') + ' 4',
	            					            labelIcon: 'images/oxygen/16x16/actions/kontact-mail.png',
	            					            name:'email4',
	            					            vtype: 'email'
	            					        }

									     	]
									    ]
								},{
								    xtype: 'columnform',
								    title: 'Web',
									labelAlign: 'top',
									formDefaults: {
									    xtype:'icontextfield',
									    anchor: '99%',
									    labelSeparator: ''
									},
									defaults:{
										 	columnWidth: 0.25
									},
									items: [[
									          {
		            					        	xtype: 'mirrortextfield',
		            					            fieldLabel: this.app.i18n._('Web'),
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
		            					        },{
		            					        	xtype: 'mirrortextfield',
		            					            fieldLabel: this.app.i18n._('Web (private)'),
		            					            labelIcon: 'images/oxygen/16x16/actions/network.png',
		            					            name:'url_home',
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
		            					        },{
		            					        	xtype: 'mirrortextfield',
		            					            fieldLabel: this.app.i18n._('Web') + ' 3',
		            					            labelIcon: 'images/oxygen/16x16/actions/network.png',
		            					            name:'url3',
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
		            					        }

									     	]
									    ]
								}


                            ]




                        }, {
                            xtype: 'tabpanel',
                            region: 'center',
                            border: false,
                            deferredRender:false,
                            height: 220,
                            split: true,
                            activeTab: 0,
                            defaults: {
                                frame: true
                            },
                            items: [{
                                title: this.app.i18n._('Adresse 1'),
                                xtype: 'columnform',
                                autoScroll:true,
                                items: [[{
                                	width:250,
                                	fieldLabel: this.app.i18n._('Zusatz'),
                                    name:'adr_one_co'
                                },{
									xtype:'checkbox',
									hideLabel: true,
									boxLabel: 'Postfach nutzen',
								    id:'contact_adr_one_use_postbox',
								    name:'adr_one_use_postbox',
								    width: 200
								}
                               ],[
                                  {
                                	width:250,
                                    fieldLabel: this.app.i18n._('Street'),
                                    name:'adr_one_street'
                                },/* {
                                	width:150,
                                    fieldLabel: this.app.i18n._('Haus-Nr'),
                                    name:'adr_one_house_nr'
                                },*/{
                                	width:100,
       								fieldLabel: this.app.i18n._('Postfach'),
       								name:'adr_one_postbox'
       							}

                                ],[
                                {
                                	width:150,
                                    fieldLabel: this.app.i18n._('Street 2'),
                                    name:'adr_one_street2'
                                }, {
                                	width:100,
                                    fieldLabel: this.app.i18n._('Region'),
                                    name:'adr_one_region'
                                },{
       								width:150,
       								fieldLabel: this.app.i18n._('Postfach PLZ'),
       								name:'adr_one_postbox_postal_code'
       							}
                                ],[
                                     {
                                	width:200,
                                    xtype: 'widget-countrycombo',
                                    fieldLabel: this.app.i18n._('Country'),
                                    id:'adr_one_countryname',
                                    name: 'adr_one_countryname',
                                    value:'DE',
                                    hiddenValue: 'Deutschland'
                                },{
                                	xtype:'combo',
                                	width:80,
                                	hideTrigger:true,
                                    fieldLabel: this.app.i18n._('Postal Code'),
                                    id:'adr_one_postalcode',
                                    name:'adr_one_postalcode'
                                }, {
                                	xtype:'combo',
                                	width:250,
                                	hideTrigger:true,
                                    fieldLabel: this.app.i18n._('City'),
                                    store:[],
                                    id:'adr_one_locality',
                                    name:'adr_one_locality'
                                }
                                ],[
                                   {
                                	   xtype:'panel',
                                	   width:300,
                                	   height:200,
                                	   id: 'adr_one_label_component',
                                	   collapsible:true,
                                	   collapsed: true,
                                	   items:[
                                	   {
                                		   xtype:'textarea',
                                		   id: 'adr_one_label_field',
                                		   fieldLabel: 'Adress-Etikett',
                                		   name: 'adr_one_label',
                                		   width: 300
                                	   }
                                	   ]
                                   }
                                ]]
                            }, {
                                title: this.app.i18n._('Adresse 2'),
                                xtype: 'columnform',
                                autoScroll:true,
                                items: [[{
                                	columnWidth: 0.3,
                                	fieldLabel: this.app.i18n._('Zusatz'),
                                    name:'adr_two_co'
                                }],[{
                                	columnWidth: 0.3,
                                    fieldLabel: this.app.i18n._('Street'),
                                    name:'adr_two_street'
                                }, {
                                	columnWidth: 0.3,
                                    fieldLabel: this.app.i18n._('Street 2'),
                                    name:'adr_two_street2'
                                }, {
                                	columnWidth: 0.2,
                                    fieldLabel: this.app.i18n._('Region'),
                                    name:'adr_two_region'
                                }], [{
                                	xtype: 'widget-countrycombo',
                                    width:200,
                                    fieldLabel: this.app.i18n._('Country'),
                                    id:'adr_two_countryname',
                                    name: 'adr_two_countryname'
                                },{
                                	xtype:'combo',
                                	width:80,
                                	hideTrigger:true,
                                    fieldLabel: this.app.i18n._('Postal Code'),
                                    id:'adr_two_postalcode',
                                    name:'adr_two_postalcode'
                                }, {
                                	xtype:'combo',
                                	width:250,
                                	hideTrigger:true,
                                	store:[],
                                    fieldLabel: this.app.i18n._('City'),
                                    id:'adr_two_locality',
                                    name:'adr_two_locality'
                                }
                                ],[
                                   {
                                	   xtype:'panel',
                                	   width:300,
                                	   height:200,
                                	   id: 'adr_two_label_component',
                                	   collapsible:true,
                                	   collapsed: true,
                                	   items:[
                                	   {
                                		   xtype:'textarea',
                                		   id: 'adr_two_label_field',
                                		   fieldLabel: 'Adress-Etikett',
                                		   name: 'adr_two_label',
                                		   width: 300
                                	   }
                                	   ]
                                   }
                                ]]
                            }, {
                                title: this.app.i18n._('Adresse 3'),
                                xtype: 'columnform',
                                items: [[{
                                	columnWidth: 0.3,
                                    fieldLabel: this.app.i18n._('Zusatz'),
                                    name:'adr3_co'
                                }],[{
                                	columnWidth: 0.3,
                                    fieldLabel: this.app.i18n._('Street'),
                                    name:'adr3_street'
                                }, {
                                	columnWidth: 0.3,
                                    fieldLabel: this.app.i18n._('Street 2'),
                                    name:'adr3_addition'
                                }], [{
                                	xtype: 'widget-countrycombo',
                                    width:200,
                                    fieldLabel: this.app.i18n._('Country'),
                                    id: 'adr3_countryname',
                                    name: 'adr3_countryname'
                                },{
                                	xtype:'combo',
                                	width:80,
                                	hideTrigger:true,
                                    fieldLabel: this.app.i18n._('Postal Code'),
                                    id:'adr3_postal_code',
                                    name:'adr3_postal_code'
                                }, {
                                	xtype:'combo',
                                	width:250,
                                	hideTrigger:true,
                                	store:[],
                                    fieldLabel: this.app.i18n._('City'),
                                    id:'adr3_location',
                                    name:'adr3_location'
                                }
                                ],[
                                   {
                                	   xtype:'panel',
                                	   width:300,
                                	   height:200,
                                	   id: 'adr3_label_component',
                                	   collapsible:true,
                                	   collapsed: true,
                                	   items:[
                                	   {
                                		   xtype:'textarea',
                                		   id: 'adr3_label_field',
                                		   fieldLabel: 'Adress-Etikett',
                                		   name: 'adr3_label',
                                		   width: 300
                                	   }
                                	   ]
                                   }
                                ]]
                            }, {
                                title: this.app.i18n._('Adresse 4'),
                                xtype: 'columnform',
                                items: [[{
                                	columnWidth: 0.4,
                                    fieldLabel: this.app.i18n._('Zusatz'),
                                    name:'adr4_co'
                                }],[{
                                	columnWidth: 0.4,
                                    fieldLabel: this.app.i18n._('Street'),
                                    name:'adr4_street'
                                }, {
                                	columnWidth: 0.4,
                                    fieldLabel: this.app.i18n._('Street 2'),
                                    name:'adr4_addition'
                                }], [{
                                	xtype: 'widget-countrycombo',
                                    width:200,
                                    fieldLabel: this.app.i18n._('Country'),
                                    id: 'adr4_countryname',
                                    name: 'adr4_countryname'
                                },{
                                	xtype:'combo',
                                	width:80,
                                	hideTrigger:true,
                                    fieldLabel: this.app.i18n._('Postal Code'),
                                    id:'adr4_postal_code',
                                    name:'adr4_postal_code'
                                }, {
                                	xtype:'combo',
                                	width:250,
                                	hideTrigger:true,
                                	store:[],
                                    fieldLabel: this.app.i18n._('City'),
                                    id:'adr4_location',
                                    name:'adr4_location'
                                }
                                ],[
                                   {
                                	   xtype:'panel',
                                	   width:300,
                                	   height:200,
                                	   id: 'adr4_label_component',
                                	   collapsible:true,
                                	   collapsed: true,
                                	   items:[
                                	   {
                                		   xtype:'textarea',
                                		   id: 'adr4_label_field',
                                		   fieldLabel: 'Adress-Etikett',
                                		   name: 'adr4_label',
                                		   width: 300
                                	   }
                                	   ]
                                   }
                                ]]
                            },
                           Tine.Addressbook.getBankingDataPanel()]
                        }, Tine.Addressbook.getAddressSelectionRadioGroups()]
                    },{
                        // activities and tags
                        region: 'east',
                        layout: 'accordion',
                        animate: true,
                        width: 210,
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
                }]
            },
            this.mapPanel
            ]

        });

        this.modLogMetaDataPanel = Tine.Tinebase.Modlog.MetaDataPanel.get({
        	title:'Metadaten'
        });

        this.activitiesPanel =  new Tine.widgets.activities.ActivitiesTabPanel({
            app: this.appName,
            record_id: (this.record) ? this.record.id : '',
            record_model: this.appName + '_Model_' + this.recordClass.getMeta('modelName')
        });
        this.customFieldsPanel = new Tine.Tinebase.widgets.customfields.CustomfieldsPanel({
            recordClass: Tine.Addressbook.Model.Contact,
            disabled: (Tine.Addressbook.registry.get('customfields').length === 0),
            quickHack: {record: this.record}
        });



        var standardPanels = [
	        this.crmPanel,
	        ///this.scrmPanel,
	        this.activitiesPanel,
	        this.modLogMetaDataPanel,
	        this.customFieldsPanel,
	        this.linkPanel
	    ];

        var additionalPanels = [Tine.Addressbook.getContactContactPanel(this.record),
            new Tine.Document.DocumentsTabPanel({
              app: Tine.Tinebase.appMgr.get('Addressbook'),
              record: this.record,
              record_id: (this.record) ? this.record.id : '',
              record_model: this.appName + '_Model_' + this.recordClass.getMeta('modelName')
            })
        ];

        contactTabPanel.add(standardPanels);
        contactTabPanel.add(additionalPanels);
       // contactTabPanel.items = contactTabPanel.items.concat(additionalPanels);

        //contactTabPanel.items = contactTabPanel.items.concat(standardPanels);

        return contactTabPanel;
    },


    // <<--




    /**
     * checks if form data is valid
     *
     * @return {Boolean}
     */
    isValid: function() {
        var form = this.getForm();
        var isValid = true;

        // you need to fill in one of: n_given n_family org_name
        // @todo required fields should depend on salutation ('company' -> org_name, etc.)
        //       and not required fields should be disabled (n_given, n_family, etc.)
        if (form.findField('n_family').getValue() == '' && form.findField('org_name').getValue() == '') {
            var invalidString = String.format(this.app.i18n._('Either {0} or {1} must be given'), this.app.i18n._('Last Name'), this.app.i18n._('Company'));

            form.findField('n_family').markInvalid(invalidString);
            form.findField('org_name').markInvalid(invalidString);

            isValid = false;
        }

        return isValid && Tine.Calendar.EventEditDialog.superclass.isValid.apply(this, arguments);
    },

    /**
     * export pdf handler
     */
    onExportContact: function() {
        var downloader = new Ext.ux.file.Download({
            params: {
                method: 'Addressbook.exportContacts',
                _filter: this.record.id,
                _format: 'pdf'
            }
        });
        downloader.start();
    },
    onAfterRender: function(){
    	this.initDropZone();

    	this.postalCodeHelpers = new Ext.util.MixedCollection();
    	this.postalCodeHelpers.add(new Tine.Addressbook.PostalAddressHelper().initialize(
    			'adr_one_postalcode', 'adr_one_locality', 'adr_one_countryname'
    	));
    	this.postalCodeHelpers.add(new Tine.Addressbook.PostalAddressHelper().initialize(
    			'adr_two_postalcode', 'adr_two_locality', 'adr_two_countryname'
    	));
    	this.postalCodeHelpers.add(new Tine.Addressbook.PostalAddressHelper().initialize(
    			'adr3_postal_code', 'adr3_location', 'adr3_countryname'
    	));
    	this.postalCodeHelpers.add(new Tine.Addressbook.PostalAddressHelper().initialize(
    			'adr4_postal_code', 'adr4_location', 'adr4_countryname'
    	));
    	this.getLockSelect().addListener('check',this.onLockSelect, this);

    	this.addBankDataHelper();

    	Ext.getCmp('bank_account_name').addListener('focus', this.presetBankName, this);

    },
    presetBankName: function(){
    	var bankName = Ext.getCmp('bank_account_name').getValue();
    	if(!bankName){
    		this.onRecordUpdate();
    		Ext.getCmp('bank_account_name').setValue(this.record.get('n_fileas'));
    	}
    },
    addBankDataHelper: function(){
    	if(this.bankDataHelpers.getCount()==0){
    		this.bankDataHelpers.add(new Tine.Billing.BankDataHelper().initialize(
    				'bank_code', 'bank_name', 'bank_account_number' , 'bank_account_name'
    		));
    	}
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
	getContactWidget: function(){
		if(!this.contactWidget){
			this.contactWidget = new Tine.Addressbook.ContactWidget({
					region: 'north',
					layout:'fit',
					height:40,
					contactEditDialog: this
			});
		}
		return this.contactWidget;
	}
});



Tine.Addressbook.ContactEditDialogPanel = Ext.extend(Ext.Panel, {
	panelManager:null,
	 windowNamePrefix: 'ContactEditWindow_',
	 appName: 'Addressbook',
	 layout:'fit',
	 bodyStyle:'padding:0px;padding-top:5px',
	 forceLayout:true,
	 initComponent: function(){
		var addressbookEditDialog = new Tine.Addressbook.ContactEditDialog(this.initialConfig);
		this.app = Tine.Tinebase.appMgr.get('Addressbook');
		var pluginPanels = [];
		if(!this.initialConfig.simpleDialog){
			addressbookEditDialog.doLayout();

			pluginPanels = this.app.getPluginEditDialogMainTabPanels(addressbookEditDialog, this.initialConfig.navigate);

			this.pluginPanels = pluginPanels;

			var recordChooserItems = {
					result: []
			};
			var plPanelCollection = new Ext.util.MixedCollection();
			plPanelCollection.addAll(pluginPanels);
			plPanelCollection.each(function(item){
				this.result = this.result.concat(item.getRecordChooserItems());
			},recordChooserItems);


			var activeTab = 0;
			var extendedDialog = false;
			if(this.initialConfig.grid !== undefined && this.initialConfig.grid.toggleExtended !== undefined){
				extendedDialog = (this.initialConfig.grid.toggleExtended.pressed == true);
			}
			if(this.initialConfig.extendedDialog !== undefined){
				extendedDialog = this.initialConfig.extendedDialog;
			}
		}
		if((pluginPanels.length>0 || extendedDialog) && !this.initialConfig.simpleDialog){
			var tabItems = [this.getMainItem(addressbookEditDialog)];

			tabItems = tabItems.concat(pluginPanels);

			if(this.initialConfig.activeContactTab !== undefined){
				for(var i in tabItems){
					if(tabItems[i].title == this.initialConfig.activeContactTab){
						activeTab = i;
					}
				}
			}
			this.items = this.getItems(tabItems, activeTab, recordChooserItems.result, addressbookEditDialog, extendedDialog);
		}else{
			this.items = [addressbookEditDialog];
		}
		Tine.Addressbook.ContactEditDialogPanel.superclass.initComponent.call(this);

		// IE layout problem -> call do layout
		this.doLayout();



	 },

	 getMainItem: function(addressbookEditDialog){
		return {
			xtype: 'panel',
			title: this.app.i18n._('Adressdaten'),
			plain: true,
			layout:'fit',
			items: [addressbookEditDialog]
		};
	 },

	 getItems: function(tabItems, activeTab, recordChooserItems, addressbookEditDialog, extendedDialog){
		if(extendedDialog){
			var recordChoosers = [{
	        	xtype: 'contactselectiongrid',
	        	title:'Kontakte',
	        	layout:'border',
	        	app: Tine.Tinebase.appMgr.get('Addressbook')
	        }];

			// push in all record choosers being delivered by the extra panels
			//recordChoosers = recordChoosers.concat(recordChooserItems);

			 var recordChooser = new Tine.widgets.dialog.SelectionGridAccordion({
				 region:'east',
				 title: 'Auswahlübersicht',
				 width:800,
				 collapsible:true,
				 bodyStyle:'padding:8px;',
				 split:true
			 });
			 recordChooser.addItems(recordChoosers);
		}

		 var tabpanel =new Ext.TabPanel({
	            border: false,
	            autoDestroy:true,
	            layoutOnTabChange: true,
	            forceLayout:true,
	            activeTab: 0,
	            region:'center',
	            width:800,
	            items:tabItems
	        });
		 tabpanel.setActiveTab(parseInt(activeTab));
		 var containerPanel = new Ext.Panel({
			 layout:'border',
			 region:'center',
			 items:[
			        addressbookEditDialog.getContactWidget(),
			        tabpanel
			 ]
		 });
		 var panelItems = [
		    containerPanel
		 ];

		 if(extendedDialog){
			 panelItems.push(recordChooser);
		 }
		 var wrapPanel = {
			xtype:'panel',
			layout:'border',
			bodyStyle: 'padding-bottom:8px;',
			items: panelItems
		 };
		 delete panelItems;
		 return[
		        wrapPanel
		 ];
	 }
});


/**
 * Opens a new contact edit dialog window
 *
 * @return {Ext.ux.Window}
 */
Tine.Addressbook.ContactEditDialog.openWindow = function (config) {
	var width, height;
	var extended = false;
	if(config.grid !== undefined && config.grid.toggleExtended !== undefined){
		extended = config.grid.toggleExtended.pressed;
	}
	if(config.extendedDialog !== undefined){
		extended = config.extendedDialog;
	}
	if(!extended){
		width = 850;
		height = 840;
	}else{
		width = 1600;
		height = 900;
	}
    // if a concreate container is selected in the tree, take this as default container
    var treeNode = Ext.getCmp('Addressbook_Tree') ? Ext.getCmp('Addressbook_Tree').getSelectionModel().getSelectedNode() : null;
    if (treeNode && treeNode.attributes && treeNode.attributes.containerType == 'singleContainer') {
        config.forceContainer = treeNode.attributes.container;
    }
    var id = (config.record && config.record.id) ? config.record.id : 0;
    var window = Tine.WindowFactory.getWindow({
        width: width,
        height: height,
        name: Tine.Addressbook.ContactEditDialog.prototype.windowNamePrefix + id,
        contentPanelConstructor: 'Tine.Addressbook.ContactEditDialogPanel',
        contentPanelConstructorConfig: config
    });
    return window;
};
