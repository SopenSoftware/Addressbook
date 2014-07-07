Ext.namespace('Tine.Addressbook');

Ext.namespace('Tine.widgets', 'Tine.widgets.dialog');

Tine.Addressbook.ContactContactPanel = function(parentDialog){
	var contactContactColumnForm = {
		region: 'center',
		xtype: 'columnform',
		id:'contactContactColumnForm',
		labelAlign: 'top',
		width: 400,
		height: 400,
		frame:true,
		formDefaults:{
			anchor: '99%',
			labelSeparator: ''
		},
		items: 
		[
		   [
		    {
		    	xtype:'textfield',
		    	fielLabel:'Übergeordneter Kontakt',
		    	id: 'from_contact_id',
		    	name: 'to_contact_id',
		    	disabled:true,
		    	value: parentDialog.fromContact.get('id')
		    }],[
				new Tine.Addressbook.ContactSelect({
	                columnWidth: 0.95,
	                fieldLabel: 'Zu verknüpfender Kontakt',
	                emptyText: 'Kontakt suchen',
	                loadingText: 'Suchen...',
	                id: 'to_contact_id',
	                name: 'to_contact_id'
	            })
			],[
				new Tine.Addressbook.ContactRelationDescriptorSelect({
	                columnWidth: 0.95,
	                fieldLabel: 'Beziehungstyp',
	                emptyText: 'Beziehungstyp suchen',
	                loadingText: 'Suchen...',
	                id: 'relation_descriptor_id',
	                name: 'relation_descriptor_id'
	            })
			],[
		        {
		        	xtype:'datetimefield',
					fieldLabel: 'Beginn',
					id: 'start_time',
					name: 'start_time',
					columnWidth: 0.5
				}, 	
				{
		        	xtype:'datetimefield',
					fieldLabel: 'Ende',
					id: 'end_time',
					name: 'end_time',
					columnWidth: 0.5
				}
			],[

			]
		]
	};
	var contactContactFieldSet = {
			xtype: 'fieldset',
			title: '',
			frame: false,
			border: false,
			height:340,
			layout: 'fit',
			items: [contactContactColumnForm]
		};
		
		delete contactColumnForm;
	
		return new Ext.Panel({
	        autoScroll: false,
	        border: false,
	        frame: false,
	        layout: 'fit',
	        items:[
	               contactContactFieldSet
			]});
}

/**
 * @author hans
 */
Tine.Addressbook.ContactContactEditDialog = Ext.extend(Tine.widgets.dialog.EditDialog, {
   	
    /**
     * @private
     */
    windowNamePrefix: 'ContactContactWindow_',
	appName: 'Addressbook',
	recordClass: Tine.Addressbook.Model.ContactContact,
	recordProxy: Tine.Addressbook.contactContactBackend,
	//loadRecord: true,
    tbarItems: [],
    evalGrants: false,
    fromContact: null, 
  	
	initComponent: function(){
		Tine.Addressbook.ContactContactEditDialog.superclass.initComponent.call(this);
	},
	initRecord: function() {
		if(!this.record){
			this.record = new this.recordClass(this.recordClass.getDefaultData(), 0);
		}
		this.onRecordLoad();
    },
	onRecordLoad: function(){
    	Tine.Addressbook.ContactContactEditDialog.superclass.onRecordLoad.call(this);
    	this.record.data.from_contact_id = this.fromContact.get('id');
	},
	onRecordUpdate: function(){
		Tine.Addressbook.ContactContactEditDialog.superclass.onRecordUpdate.call(this);
		this.record.data.from_contact_id = this.fromContact.get('id');
	},

    getContactContactForm: function(){
    	return Ext.getCmp('contactContactColumnForm');
    },
    /**
     * returns dialog
     */
    getFormItems: function() {
       this.form = new Tine.Addressbook.ContactContactPanel(this);
       return this.form;
    },
    /*initActions: function(){
        this.action_generateTimesheet = new Ext.Action({
            text: 'Ok',
            minWidth: 70,
            scope: this,
            handler: this.onUpdateRecord,
            disabled: false
        });
        Tine.Timetracker.SoWorkSessionEditDialog.superclass.initActions.call(this);
    },*/
    initButtons: function(){
        this.buttons = [
            this.action_cancel,
            this.action_applyChanges
       ];
    }
});

/**
 * credentials dialog popup / window
 */
Tine.Addressbook.ContactContactEditDialog.openWindow = function (config) {
	// REMARK HH[08.05.2010]:Tinebase Editdialog changed 
	// forceTitle added (otherwise window is titled with record name)
	config.forceTitle = 'Sitzung bearbeiten';
    var window = Tine.WindowFactory.getWindow({
        width: 400,
        height: 300,
        contentPanelConstructor: 'Tine.Addressbook.ContactContactEditDialog',
		contentPanelConstructorConfig: config,
        modal: true
    });
    return window;
};
	