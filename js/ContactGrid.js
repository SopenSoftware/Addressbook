/*
 * Tine 2.0
 * 
 * @package     Addressbook
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @copyright   Copyright (c) 2007-2010 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id: ContactGrid.js 14794 2010-06-04 10:22:16Z f.wiechmann@metaways.de $
 *
 */
 
Ext.ns('Tine.Addressbook');

/**
 * Contact grid panel
 * 
 * @namespace   Tine.Addressbook
 * @class       Tine.Addressbook.ContactGridPanel
 * @extends     Tine.widgets.grid.GridPanel
 * 
 * <p>Contact Grid Panel</p>
 * 
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @copyright   Copyright (c) 2007-2010 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id: ContactGrid.js 14794 2010-06-04 10:22:16Z f.wiechmann@metaways.de $
 * 
 * @param       {Object} config
 * @constructor
 * Create a new Tine.Addressbook.ContactGridPanel
 */
Tine.Addressbook.ContactGridPanel = function(config) {
    Ext.apply(this, config);
    Tine.Addressbook.ContactGridPanel.superclass.constructor.apply(this, arguments);
};


Ext.extend(Tine.Addressbook.ContactGridPanel, Tine.widgets.grid.GridPanel, {
    /**
     * record class
     * @cfg {Tine.Addressbook.Model.Contact} recordClass
     */
    recordClass: Tine.Addressbook.Model.Contact,
    
    /**
     * grid specific
     * @private
     */ 
    defaultSortInfo: {field: 'n_fileas', direction: 'ASC'},
    defaultPaging: {
        start: 0,
        limit: 50
    },
    gridConfig: {
        loadMask: true,
        autoExpandColumn: 'n_fileas',
        // drag n drop
        enableDragDrop: true,
        ddGroup: 'containerDDGroup'
    },
    copyEditAction: true,
    felamimail: false,
    customized: false,
    /**
     * phoneMenu
     * @type Ext.menu.Menu 
     * 
     * TODO try to disable 'activation' of toolbar button when ctx menu button is selected
     */
    phoneMenu: null,
    
    /**
     * inits this cmp
     * @private
     */
    initComponent: function() {
        this.recordProxy = Tine.Addressbook.contactBackend;
        this.customize();
        // check if felamimail is installed and user has run right and wants to use felamimail in adb
        if (Tine.Felamimail && Tine.Tinebase.common.hasRight('run', 'Felamimail') && Tine.Felamimail.registry.get('preferences').get('useInAdb')) {
            this.felamimail = (Tine.Felamimail.registry.get('preferences').get('useInAdb') == 1);
        }
        this.gridConfig.cm = this.getColumnModel();
        this.filterToolbar = this.getFilterToolbar();
        this.detailsPanel = this.getDetailsPanel();
        
        this.plugins = this.plugins || [];
        this.plugins.push(this.filterToolbar);
        
        Tine.Addressbook.ContactGridPanel.superclass.initComponent.call(this);
    },
    customize: function(){
    	 try{
 	        if(Tine.Addressbook.Custom && Tine.Addressbook.Custom.Actions){
 	        	Tine.Addressbook.Custom.Actions.addHandlers(this);
 	        	Tine.Addressbook.Custom.Actions.initActions(this); 
 	        	this.customized = true;
 	        }
         }catch(e){
         	// no actions to attach
        	 this.customized = false;
         }
    	
    },
    isCustomized: function(){
    	return this.customized;
    },
    /**
     * returns column model
     * 
     * @return Ext.grid.ColumnModel
     * @private
     */
    getColumnModel: function() {
        
        var columns = [
            { id: 'tid', header: this.app.i18n._('Type'), dataIndex: 'tid', width: 30, renderer: this.contactTidRenderer.createDelegate(this), hidden: false },
            { id: 'main_category_contact_id', header: this.app.i18n._('Hauptkategorie'), renderer: Sopen.GenericAttribute.Renderer, dataIndex: 'main_category_contact_id' },
            { id: 'responsible_id', header: this.app.i18n._('Betreuer'), dataIndex: 'responsible_id', valueType: 'user' },
            { id: 'debitor_ext_id', header: this.app.i18n._('Debitor-Nr'), dataIndex: 'debitor_ext_id', sortable: true, hidden: false },
            { id: 'tags', header: this.app.i18n._('Tags'), dataIndex: 'tags', width: 50, renderer: Tine.Tinebase.common.tagsRenderer, sortable: false, hidden: false  },
            
            { id: 'n_family', header: this.app.i18n._('Last Name'), dataIndex: 'n_family' },
            { id: 'n_given', header: this.app.i18n._('First Name'), dataIndex: 'n_given', width: 80 },
            { id: 'n_fn', header: this.app.i18n._('Full Name'), dataIndex: 'n_fn' },
            { id: 'n_fileas', header: this.app.i18n._('Display Name'), dataIndex: 'n_fileas', hidden: false},
            { id: 'sex', header: this.app.i18n._('Geschlecht'), dataIndex: 'sex', sortable:true, hidden:true, renderer:Tine.Addressbook.renderer.sexShort },
            { id: 'bday', header: this.app.i18n._('Birthday'), dataIndex: 'bday', renderer: Tine.Tinebase.common.dateRenderer },
            
            { id: 'org_name', header: this.app.i18n._('Company'), dataIndex: 'org_name', width: 200, hidden: false },
            { id: 'company2', header: this.app.i18n._('Firma2'), dataIndex: 'company2', width: 200, hidden: false },
            { id: 'company3', header: this.app.i18n._('Firma3'), dataIndex: 'company3', width: 200, hidden: false },
            
            { id: 'org_unit', header: this.app.i18n._('Unit'), dataIndex: 'org_unit'  },
            { id: 'title', header: this.app.i18n._('Job Title'), dataIndex: 'title' },
            { id: 'role', header: this.app.i18n._('Job Role'), dataIndex: 'role' },
            { id: 'room', header: this.app.i18n._('Room'), dataIndex: 'room' },
            
            { id: 'partner_forename', header: this.app.i18n._('Part.Vorname'), dataIndex: 'partner_forename', sortable:true, hidden:true },
    		{ id: 'partner_lastname', header: this.app.i18n._('Part.Nachname'), dataIndex: 'partner_lastname', sortable:true, hidden:true },
    		{ id: 'partner_sex', header: this.app.i18n._('Part.Geschl'), dataIndex: 'partner_sex', sortable:true, hidden:true, renderer:Tine.Addressbook.renderer.sexShort },
    		{ id: 'partner_birthday', header: this.app.i18n._('Part.Geb.'), dataIndex: 'partner_birthday', renderer: Tine.Tinebase.common.dateRenderer },
    		
            { id: 'adr_one_street', header: this.app.i18n._('Street'), dataIndex: 'adr_one_street' },
            { id: 'adr_one_locality', header: this.app.i18n._('City'), dataIndex: 'adr_one_locality', width: 150, hidden: false },
            { id: 'adr_one_region', header: this.app.i18n._('Region'), dataIndex: 'adr_one_region' },
            { id: 'adr_one_postalcode', header: this.app.i18n._('Postalcode'), dataIndex: 'adr_one_postalcode' },
            { id: 'adr_one_postbox', header: this.app.i18n._('Postfach'), dataIndex: 'adr_one_postbox' },
            { id: 'adr_one_use_postbox', header: this.app.i18n._('Postfach nutzen'), dataIndex: 'adr_one_use_postbox' },
            { id: 'adr_one_postbox_postal_code', header: this.app.i18n._('Postfach PLZ'), dataIndex: 'adr_one_postbox_postal_code' },
             
            { id: 'adr_one_countryname', header: this.app.i18n._('Country'), dataIndex: 'adr_one_countryname' },
            { id: 'adr_two_street', header: this.app.i18n._('Street (private)'), dataIndex: 'adr_two_street' },
            { id: 'adr_two_locality', header: this.app.i18n._('City (private)'), dataIndex: 'adr_two_locality' },
            { id: 'adr_two_region', header: this.app.i18n._('Region (private)'), dataIndex: 'adr_two_region' },
            { id: 'adr_two_postalcode', header: this.app.i18n._('Postalcode (private)'), dataIndex: 'adr_two_postalcode' },
            { id: 'adr_two_countryname', header: this.app.i18n._('Country (private)'), dataIndex: 'adr_two_countryname' },
            
            { id: 'contact_source', header: this.app.i18n._('Ursprung'), dataIndex: 'contact_source', hidden:true, sortable:true },
    		{ id: 'province', header: this.app.i18n._('Bundesland'), dataIndex: 'province', hidden:true, sortable:true },
    		{ id: 'district', header: this.app.i18n._('Reg.bez.'), dataIndex: 'district', hidden:true, sortable:true },
    		{ id: 'county', header: this.app.i18n._('Kreis'), dataIndex: 'county', hidden:true, sortable:true },
    		{ id: 'community', header: this.app.i18n._('Gemeinde'), dataIndex: 'community', hidden:true, sortable:true },
    		{ id: 'community_key', header: this.app.i18n._('Gem.schlüss.'), dataIndex: 'community_key', hidden:true, sortable:true },
    		{ id: 'cultural_area', header: this.app.i18n._('Kulturraum'), dataIndex: 'cultural_area', hidden:true, sortable:true },
    		
            { id: 'email', header: this.app.i18n._('Email'), dataIndex: 'email', width: 150, hidden: false },
            { id: 'tel_work', header: this.app.i18n._('Phone'), dataIndex: 'tel_work', hidden: false },
            { id: 'tel_cell', header: this.app.i18n._('Mobile'), dataIndex: 'tel_cell', hidden: false },
            { id: 'tel_fax', header: this.app.i18n._('Fax'), dataIndex: 'tel_fax' },
            { id: 'tel_car', header: this.app.i18n._('Car phone'), dataIndex: 'tel_car' },
            { id: 'tel_pager', header: this.app.i18n._('Pager'), dataIndex: 'tel_pager' },
            { id: 'tel_home', header: this.app.i18n._('Phone (private)'), dataIndex: 'tel_home' },
            { id: 'tel_fax_home', header: this.app.i18n._('Fax (private)'), dataIndex: 'tel_fax_home' },
            { id: 'tel_cell_private', header: this.app.i18n._('Mobile (private)'), dataIndex: 'tel_cell_private' },
            { id: 'email_home', header: this.app.i18n._('Email (private)'), dataIndex: 'email_home' },
            { id: 'url', header: this.app.i18n._('Web'), dataIndex: 'url' },
            { id: 'url_home', header: this.app.i18n._('URL (private)'), dataIndex: 'url_home' },
            { id: 'note', header: this.app.i18n._('Note'), dataIndex: 'note' },
            { id: 'tz', header: this.app.i18n._('Timezone'), dataIndex: 'tz' },
            { id: 'geo', header: this.app.i18n._('Geo'), dataIndex: 'geo' },
            
            { id: 'is_affiliator', header: this.app.i18n._('Ist Werber'), dataIndex: 'is_affiliator', hidden:true, sortable:true },
            { id: 'is_affiliated', header: this.app.i18n._('wurde geworben'), dataIndex: 'is_affiliated', hidden:true, sortable:true },
            { id: 'affiliate_contact_id', header: this.app.i18n._('Werber-Nr'), dataIndex: 'affiliate_contact_id', hidden:true, sortable:true },
            { id: 'affiliator_provision_date', header: this.app.i18n._('Werb.prov.Ausz'), dataIndex: 'affiliator_provision_date', hidden:true, sortable:true, renderer: Tine.Tinebase.common.dateRenderer  },
            { id: 'affiliator_provision', header: this.app.i18n._('Werberprovision'), dataIndex: 'affiliator_provision', hidden:true, sortable:true },
            { id: 'count_magazines', header: this.app.i18n._('Anz.Zeitungen'), dataIndex: 'count_magazines', hidden:true, sortable:true },
            { id: 'count_additional_magazines', header: this.app.i18n._('zus. Zeitungen'), dataIndex: 'count_additional_magazines', hidden:true, sortable:true },
            { id: 'info_letter_date', header: this.app.i18n._('Datum Infoschreiben'), dataIndex: 'info_letter_date', hidden:true, sortable:true, renderer: Tine.Tinebase.common.dateRenderer  },
            
            { id: 'creation_time', header: this.app.i18n._('Creation Time'), dataIndex: 'creation_time', renderer: Tine.Tinebase.common.dateRenderer },
            { id: 'last_modified_time', header: this.app.i18n._('Last Modified Time'), dataIndex: 'last_modified_time', renderer: Tine.Tinebase.common.dateRenderer },
            { id: 'manager_kind', header: this.app.i18n._('Art Entscheider'), dataIndex: 'manager_kind' },
            { id: 'dl_customer_value', header: this.app.i18n._('Kundenwert'), dataIndex: 'dl_customer_value', renderer: Tine.Tinebase.common.customerValueRenderer },
            { id: 'dl_contact_type', header: this.app.i18n._('Typ'), dataIndex: 'dl_contact_type' }
            
        ];
        
        columns = columns.concat(
        		Tine.Addressbook.ContactGridAdditionalColumns.get()
        );
        
        return new Ext.grid.ColumnModel({ 
            defaults: {
                sortable: true,
                hidden: true,
                resizable: true
            },
            // add custom fields
            columns: columns.concat(this.getCustomfieldColumns())
        });
    },
    
    /**
     * @private
     */
    initActions: function() {
        this.actions_exportContact = new Ext.Action({
            requiredGrant: 'exportGrant',
            text: this.app.i18n._('Export Contact'),
            iconCls: 'action_export',
            scope: this,
            requiredGrant: 'readGrant',
            //disabled: true,
            allowMultiple: true,
            menu: {
                items: [
                    new Tine.widgets.grid.ExportButton({
                        text: this.app.i18n._('Export as PDF'),
                        iconCls: 'action_exportAsPdf',
                        format: 'pdf',
                        exportFunction: 'Addressbook.exportContacts',
                        gridPanel: this
                    }),
                    new Tine.widgets.grid.ExportButton({
                        text: this.app.i18n._('Export as CSV'),
                        iconCls: 'tinebase-action-export-csv',
                        format: 'csv',
                        exportFunction: 'Addressbook.exportContacts',
                        gridPanel: this
                    }),
                    new Tine.widgets.grid.ExportButton({
                        text: this.app.i18n._('Export as ODS'),
                        format: 'ods',
                        iconCls: 'tinebase-action-export-ods',
                        exportFunction: 'Addressbook.exportContacts',
                        gridPanel: this
                    }),
                    new Tine.widgets.grid.ExportButton({
                        text: this.app.i18n._('Export as XLS'),
                        format: 'xls',
                        iconCls: 'tinebase-action-export-xls',
                        exportFunction: 'Addressbook.exportContacts',
                        gridPanel: this
                    })
                ]
            }
        });
        
        this.phoneMenu = new Ext.menu.Menu({
        });
        this.actions_callContact = new Ext.Action({
            requiredGrant: 'readGrant',
            hidden: ! (Tine.Phone && Tine.Tinebase.common.hasRight('run', 'Phone')),
            actionUpdater: this.updatePhoneActions,
            text: this.app.i18n._('Call contact'),
            disabled: true,
            iconCls: 'PhoneIconCls',
            menu: this.phoneMenu,
            scope: this
        });
        
        this.actions_composeEmail = new Ext.Action({
            requiredGrant: 'readGrant',
            hidden: ! this.felamimail,
            text: this.app.i18n._('Compose email'),
            disabled: true,
            handler: this.onComposeEmail,
            iconCls: 'action_composeEmail',
            scope: this,
            allowMultiple: true
        });

        this.actions_import = new Ext.Action({
            //requiredGrant: 'addGrant',
            text: this.app.i18n._('Import contacts'),
            disabled: false,
            handler: this.onImport,
            iconCls: 'action_import',
            scope: this,
            allowMultiple: true
        });
        
        this.actions_createLetter = new Ext.Action({
             requiredGrant: 'readGrant',
             allowMultiple: false,
             text: this.app.i18n._('Einfaches Anschreiben'),
 			 disabled: false,
             handler: this.onCreateLetterPDF,
             iconCls: 'action_exportAsPdf',
             scope: this
         });
        
        this.actions_addCustomContact = new Ext.Action({
            requiredGrant: 'editGrant',
            allowMultiple: false,
            text: this.app.i18n._('Kontakt hinzufügen (dialogum)'),
			 disabled: false,
            handler: this.onAddCustomContact,
            iconCls: 'action_add',
            scope: this
        });
        
        this.actions_editCustomContact = new Ext.Action({
            requiredGrant: 'editGrant',
            allowMultiple: false,
            text: this.app.i18n._('Kontakt bearbeiten (dialogum)'),
			 disabled: false,
            handler: this.onEditCustomContact,
            iconCls: 'action_edit',
            scope: this
        });
        
        this.actions_createLetterForm = new Ext.Action({
            requiredGrant: 'readGrant',
            allowMultiple: false,
            text: this.app.i18n._('Anschreiben (Webform)'),
			disabled: false,
            handler: this.onCreateLetterFormPDF,
            iconCls: 'action_exportAsPdf',
            scope: this
        });
       
        
        this.actions_createMultiLetter = new Ext.Action({
            requiredGrant: 'readGrant',
            allowMultiple: false,
            text: this.app.i18n._('Serienbrief'),
			disabled: false,
            handler: this.onCreateMultiLetter,
            iconCls: 'action_exportAsPdf',
            scope: this
        });
        
        this.actions_writeLetter = new Ext.Action({
            text: this.app.i18n._('Anschreiben'),
            iconCls: 'action_exportAsPdf',
            scope: this,
            disabled: false,
            allowMultiple: true,
            menu: {
                items: [
                    this.actions_createLetter,
                    this.actions_createLetterForm,
                    this.actions_createMultiLetter
                ]
            }
        });
        
        this.action_extendedDialog =  new Ext.Action({
        	requiredGrant: 'readGrant',
        	stateId: 'sopen-contact-dialog-extended-toggle',
        	stateful: true,
        	stateEvents: ['toggle'],
        	getState: function(){
        		return {
        			pressed: this.pressed
        		};
        	},
        	enableToggle:true,
            text: this.app.i18n._('Erweiterter Dialog'),
            iconCls: 'action_extendedDialog',
            handler: this.onExtendedDialog,
            scope: this
        });
        
        this.actions_addContactContact = new Ext.Action({
            requiredGrant: 'editGrant',
            allowMultiple: false,
            text: this.app.i18n._('Relate contact'),
			disabled: false,
            handler: this.onAddContactContact,
            iconCls: 'action_addContact',
            scope: this
        });
        
        var actions = 
        [
	         this.actions_exportContact,
	         this.actions_callContact,
	         this.actions_composeEmail,
	         this.actions_import,
	         this.actions_createLetter,
	         this.action_extendedDialog
        ];
        
        try{
	        if(this.isCustomized()){
	        	actions = actions.concat(Tine.Addressbook.Custom.Actions.getCustomToolbarItems(this));
	        }
        }catch(e){
        	// no actions to attach
        }
        
        //register actions in updater
        this.actionUpdater.addActions([
           actions
        ]);
                
        Tine.Addressbook.ContactGridPanel.superclass.initActions.call(this);
    },

    /**
     * add custom items to action toolbar
     * 
     * @return {Object}
     */
    getActionToolbarItems: function() {
    	this.toggleExtended = new Ext.Button(this.action_extendedDialog);
    	this.actions_reverseAction = new Ext.Action({
        	id: 'reverseActionButton',
         	allowMultiple: false,
         	disabled:true,
         	text: 'Storno',
            menu:{
             	items:[
             	       this.reverseButton,
             	       this.partReverseButton,
 					   this.delInvoiceButton
             	]
             }
         });
    	var toolbarItems = [
            Ext.apply(new Ext.SplitButton(this.actions_callContact), {
                scale: 'medium',
                rowspan: 2,
                iconAlign: 'top',
                arrowAlign:'right'
            }),
            Ext.apply(new Ext.Button(this.actions_composeEmail), {
                scale: 'medium',
                rowspan: 2,
                iconAlign: 'top'
            }),
            Ext.apply(new Ext.Button(this.actions_writeLetter), {
                scale: 'medium',
                rowspan: 2,
                iconAlign: 'top'
            }),
            Ext.apply(this.toggleExtended, {
                scale: 'medium',
                rowspan: 2,
                iconAlign: 'top'
            }),
            {
                xtype: 'buttongroup',
                columns: 1,
                frame: false,
                items: [
                    this.actions_exportContact,
                    this.actions_import
                ]
            }
            
        ]
    	
    	 try{
 	        if(this.isCustomized()){
 	        	toolbarItems =	toolbarItems.concat(Tine.Addressbook.Custom.Actions.getCustomToolbarItems(this));
 	        	 
 	        }
         }catch(e){
         	// no actions to attach
         }
         
         return toolbarItems;
         
    },
    
    /**
     * add custom items to context menu
     * 
     * @return {Array}
     */
    getContextMenuItems: function() {
        var items = [
            '-',
            this.actions_exportContact,
            '-',
            this.actions_callContact,
            this.actions_composeEmail,
            '-',
            this.actions_createLetter,
            '-',
            this.actions_addContactContact
        ];
        
        if(this.isCustomized()){
        	items =	items.concat(Tine.Addressbook.Custom.Actions.getCustomContextMenuItems(this));
        	 
        }
        
        return items;
    },
    
    /**
     * updates call menu
     * 
     * @param {Ext.Action} action
     * @param {Object} grants grants sum of grants
     * @param {Object} records
     */
    updatePhoneActions: function(action, grants, records) {
        if (action.isHidden()) {
            return;
        }
        
        this.phoneMenu.removeAll();
        this.actions_callContact.setDisabled(true);
            
        if (records.length == 1) {
            var contact = records[0];
            
            if (! contact) {
                return false;
            }
            
            if(!Ext.isEmpty(contact.data.tel_work)) {
                this.phoneMenu.add({
                   text: this.app.i18n._('Work') + ' ' + contact.data.tel_work + '',
                   scope: this,
                   handler: this.onCallContact,
                   field: 'tel_work'
                });
                action.setDisabled(false);
            }
            if(!Ext.isEmpty(contact.data.tel_home)) {
                this.phoneMenu.add({
                   text: this.app.i18n._('Home') + ' ' + contact.data.tel_home + '',
                   scope: this,
                   handler: this.onCallContact,
                   field: 'tel_home'
                });
                action.setDisabled(false);
            }
            if(!Ext.isEmpty(contact.data.tel_cell)) {
                this.phoneMenu.add({
                   text: this.app.i18n._('Cell') + ' ' + contact.data.tel_cell + '',
                   scope: this,
                   handler: this.onCallContact,
                   field: 'tel_cell'
                });
                action.setDisabled(false);
            }
            if(!Ext.isEmpty(contact.data.tel_cell_private)) {
                this.phoneMenu.add({
                   text: this.app.i18n._('Cell private') + ' ' + contact.data.tel_cell_private + '',
                   scope: this,
                   handler: this.onCallContact,
                   field: 'tel_cell'
                });
                action.setDisabled(false);
            }
        }
    },
        
    /**
     * calls a contact
     * @param {Button} btn 
     */
    onCallContact: function(btn) {
        var number;

        var contact = this.grid.getSelectionModel().getSelected();
        
        if (! contact) {
            return;
        }
        
        if (!Ext.isEmpty(contact.get(btn.field))) {
            number = contact.get(btn.field);
        } else if(!Ext.isEmpty(contact.data.tel_work)) {
            number = contact.data.tel_work;
        } else if (!Ext.isEmpty(contact.data.tel_cell)) {
            number = contact.data.tel_cell;
        } else if (!Ext.isEmpty(contact.data.tel_cell_private)) {
            number = contact.data.tel_cell_private;
        } else if (!Ext.isEmpty(contact.data.tel_home)) {
            number = contact.data.tel_work;
        }

        Tine.Phone.dialPhoneNumber(number);
    },
    
    /**
     * compose an email to selected contacts
     * 
     * @param {Button} btn 
     * 
     * TODO make this work for filter selections (not only the first page)
     */
    onComposeEmail: function(btn) {
        
        var contacts = this.grid.getSelectionModel().getSelections();
        
        var defaults = Tine.Felamimail.Model.Message.getDefaultData();
        defaults.body = Tine.Felamimail.getSignature();

        defaults.to = [];
        for (var i=0; i<contacts.length; i++) {
            if (contacts[i].get('email') != '') {
                defaults.to.push(contacts[i].get('email'));
            } else if (contacts[i].get('email_home') != '') {
                defaults.to.push(contacts[i].get('email_home'));
            }
        }
        
        var record = new Tine.Felamimail.Model.Message(defaults, 0);
        var popupWindow = Tine.Felamimail.MessageEditDialog.openWindow({
            record: record
        });
    },

    /**
     * import contacts
     * 
     * @param {Button} btn 
     * 
     * TODO generalize this & the import button
     */
    onImport: function(btn) {
        var popupWindow = Tine.widgets.dialog.ImportDialog.openWindow({
            appName: 'Addressbook',
            // update grid after import
            listeners: {
                scope: this,
                'update': function(record) {
                    this.loadData(true);
                }
            },
            record: new Tine.Tinebase.Model.ImportJob({
                // TODO get selected container -> if no container is selected use default container
                container_id: Tine.Addressbook.registry.get('defaultAddressbook'),
                model: this.recordClass,
                import_definition_id:  Tine.Addressbook.registry.get('defaultImportDefinition').id
            }, 0)
        });
    },
    
    /**
     * create letter as PDF form prefilled with contact data
     * Relevant areas are editable
     */
	onCreateLetterPDF: function(){
		  var contact = this.grid.getSelectionModel().getSelected();
		  if(contact){
			  var myWindow = Tine.WindowFactory.getWindow(
			    {
					  url: SopenConfig.customizePath +'pdf.php?form=true&contactId='+contact.get('id'),
					  name: "PDFCreateLetterWindow",
					  height: 590,
					  width: 1024,
					  title: "Kontakt anschreiben"
		  		}
			  );
		  }
	},
	
	/**
     * create letter as PDF form prefilled with contact data
     * Relevant areas are editable
     */
	onCreateLetterFormPDF: function(){
		var sm = this.grid.getSelectionModel();
        
        // return if no rows are selected
        if (sm.getCount() === 0) {
            return false;
        }
        
        var filterSettings = sm.getSelectionFilter();
        
        var win = Tine.Addressbook.PrintContactDialog.openWindow({
			panelTitle: 'Serienbrief schreiben',
    		actionType: 'printMultiLetter',
    		predefinedFilter: filterSettings,
    		textEditable:true
		});
	},
	
	onCreateMultiLetter: function(){
		var sm = this.grid.getSelectionModel();
        
        // return if no rows are selected
        if (sm.getCount() === 0) {
            return false;
        }
        
        var filterSettings = sm.getSelectionFilter();
        
        var win = Tine.Addressbook.PrintContactDialog.openWindow({
			panelTitle: 'Serienbrief schreiben',
    		actionType: 'printMultiLetter',
    		predefinedFilter: filterSettings,
    		textEditable:false
		});
	},
	
	onExtendedDialog: function(bt){
		this.showExtendedDialog = bt.pressed;
	},
	
	onAddContactContact: function(){
		 var contact = this.grid.getSelectionModel().getSelected();
		 Tine.Addressbook.ContactContactEditDialog.openWindow(
			{
				fromContact: contact,
				record: null
			}	 
		 );
	},
        
    /**
     * tid renderer
     * 
     * @private
     * @return {String} HTML
     */
    contactTidRenderer: function(data, cell, record) {
    	var imageUrl = 'images/';
    	if(Sopen.Config.runtime.resourceUrl.tine.images !== undefined){
	   		imageUrl = Sopen.Config.runtime.resourceUrl.tine.images;
	   	}
        switch(record.get('type')) {
            case 'user':
                return "<img src='"+imageUrl+"oxygen/16x16/actions/user-female.png' width='12' height='12' alt='contact' ext:qtip='" + this.app.i18n._("Internal Contact") + "'/>";
            default:
                return "<img src='"+imageUrl+"oxygen/16x16/actions/user.png' width='12' height='12' alt='contact'/>";
        }
    },
    
    /**
     * returns details panel
     * 
     * @private
     * @return {Tine.Addressbook.ContactGridDetailsPanel}
     */
    getDetailsPanel: function() {
        return new Tine.Addressbook.ContactGridDetailsPanel({
            gridpanel: this,
            il8n: this.app.i18n,
            felamimail: this.felamimail
        });
    },
    
    /**
     * copy record (and unset some fields)
     * 
     * @param {Object} recordData
     * @return Record
     */
    copyRecord: function (recordData) {
        // we need to unset account id because it is unique and linked to an user
        delete recordData.account_id;
        
        var result = Tine.Addressbook.ContactGridPanel.superclass.copyRecord.call(this, recordData);
        return result;
    }
    /*,
    onEditInNewWindow: function(button, event) {
        var record; 
        if (button.actionType == 'edit') {
            if (! this.action_editInNewWindow || this.action_editInNewWindow.isDisabled()) {
                // if edit action is disabled or not available, we also don't open a new window
                return false;
            }
            var selectedRows = this.grid.getSelectionModel().getSelections();
            record = selectedRows[0];
            
        } else if (button.actionType == 'copy') {
            var selectedRows = this.grid.getSelectionModel().getSelections();
            record = this.copyRecord(selectedRows[0].data);

        } else {
            record = new this.recordClass(this.recordClass.getDefaultData(), 0);
        }
        
        var popupWindow = Tine[this.app.appName][this.recordClass.getMeta('modelName') + 'EditDialog'].openWindow({
            record: record,
            grid: this,
            listeners: {
                scope: this,
                'update': function(record) {
                    this.loadData(true, true, true);
                },
                'provideduplicates':function(ids) {
                	if(typeof ids == 'array' && ids.length>0){
                		this.filterByIds(ids);
                	}
                }
            }
        });
    },
    filterByIds: function(ids){
    	this.coFilter = {	
			field:'id',
			operator:'in',
			value: ids
		};
    	this.filterToolbar.deleteAllFilters();
    },
    onStoreBeforeload: function(store, options) {
		Tine.Addressbook.ContactGridPanel.superclass.onStoreBeforeload.call(this, store, options);
		if(this.coFilter){
    		delete options.params.filter;
        	options.params.filter = [];
			options.params.filter.push(this.coFilter);
			this.coFilter = null;
		}else{
			return true;
		}
    }*/
});
