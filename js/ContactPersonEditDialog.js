Ext.namespace('Tine.Addressbook');

Tine.Addressbook.ContactPersonEditDialog = Ext.extend(Tine.widgets.dialog.EditDialog, {
	
	/**
	 * @private
	 */
	windowNamePrefix: 'ContactPersonEditWindow_',
	appName: 'Addressbook',
	recordClass: Tine.Addressbook.Model.ContactPerson,
	recordProxy: Tine.Addressbook.contactPersonBackend,
	loadRecord: false,
	evalGrants: false,
	contactRecord: null,
	initComponent: function(){
		this.on('load',this.onLoadContactPerson, this);
		this.on('afterrender',this.onAfterRender,this);
		Tine.Addressbook.ContactPersonEditDialog.superclass.initComponent.call(this);
	},
	onLoadContactPerson: function(){

		if(this.contactRecord){
			Ext.getCmp('contact_person_contact_id').setValue(this.contactRecord.getId());
			Ext.getCmp('contact_person_contact_id').disable();
   		}
	},
	onAfterRender: function(){
		
	},
	/**
	 * returns dialog
	 * 
	 * NOTE: when this method gets called, all initalisation is done.
	 */
	getFormItems: function() {
	    return {
	        xtype: 'panel',
	        border: false,
	        frame:true,
	        items:[{xtype:'columnform',items:[[
	              {xtype:'hidden', name:'id'},{xtype:'hidden', id:'contact_person_contact_id', name:'contact_id'},
	              {
						xtype:'checkbox',
						hideLabel: true,
						boxLabel: 'ist Hauptansprechpartner',
					    name:'is_main_contact_person',
					    width: 200
					} 
	           ],[   
	              {
					   fieldLabel:'Vorname',
					   name: 'n_given',
					   disabledClass: 'x-item-disabled-view',
					   width: 400,
					   disabled: true
				   }
			   ],[
				   {
					   fieldLabel:'Nachname',
					   name: 'n_family',
					   disabledClass: 'x-item-disabled-view',
					   width: 400,
					   disabled: true
				   }
			   ],[
				   {
					   fieldLabel:'Telefon',
					   name: 'tel_work',
					   disabledClass: 'x-item-disabled-view',
					   width: 200,
					   disabled: true
				   },{
					   fieldLabel:'Mobil',
					   name: 'tel_cell',
					   disabledClass: 'x-item-disabled-view',
					   width: 200,
					   disabled: true
				   }
				  ],[
					   {
						   fieldLabel:'E-Mail',
						   name: 'email',
						   disabledClass: 'x-item-disabled-view',
						   width: 400,
						   disabled: true
					   }
					
				  ],[
						 
					   {
						   fieldLabel:'Abteilung',
						   name: 'role',
						   disabledClass: 'x-item-disabled-view',
						   width: 400,
						   disabled: true
						}
					   
				   
	             ]
	        ]}]
	    };
	}
});

/**
 * Addressbook Edit Popup
 */
Tine.Addressbook.ContactPersonEditDialog.openWindow = function (config) {
    var id = (config.record && config.record.id) ? config.record.id : 0;
    var window = Tine.WindowFactory.getWindow({
        width: 600,
        height: 450,
        name: Tine.Addressbook.ContactPersonEditDialog.prototype.windowNamePrefix + id,
        contentPanelConstructor: 'Tine.Addressbook.ContactPersonEditDialog',
        contentPanelConstructorConfig: config
    });
    return window;
};