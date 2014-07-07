Ext.namespace('Tine.Addressbook');

Tine.Addressbook.getMainContactPersonIcon = function(value, meta, record){
	var qtip, icon;
	
	var isMainContactPerson = record.get('is_main_contact_person');
	
	if(isMainContactPerson == 0){
		qtip = '';
		icon = Sopen.Config.runtime.resourceUrl.tine.images + '/oxygen/16x16/actions/users.png';
	}else{
		qtip = 'Ist Hauptansprechpartner';
		icon = Sopen.Config.runtime.resourceUrl.tine.images + '/oil/16x16/apps/osmo.png';
	}

	
	return '<img class="TasksMainGridStatus" src="' + icon + '" ext:qtip="' + qtip + '">';
};

/**
 * Timeaccount grid panel
 */
Tine.Addressbook.ContactPersonGridPanel = Ext.extend(Tine.widgets.grid.GridPanel, {
    recordClass: Tine.Addressbook.Model.ContactPerson,
    evalGrants: false,
    inDialog: false,
    // grid specific
    defaultSortInfo: {field: 'id', direction: 'DESC'},
    ddConfig:{
    	ddGroup: 'ddGroupContact'
    },
    gridConfig: {
        loadMask: true,
        autoExpandColumn: 'title'
    },
    initComponent: function() {
        var me = this;
        me.recordProxy = Tine.Addressbook.contactPersonBackend;        
        me.contextMenu = new Ext.menu.Menu({
            items: [
                {
                    text: 'Als Hauptansprechpartner nutzen',
                    handler: function() {
                        var contactPerson = me.grid.getSelectionModel().getSelected();
                        contactPerson.set('is_main_contact_person', true);
                        Tine.Addressbook.contactPersonBackend.saveRecord(contactPerson, {
                            scope: this,
                            success: function() {
                                me.onReloadContactPerson();
                            }
                        });
                    }
                }, new Ext.Action({
                    requiredGrant: 'deleteGrant',
                    text: 'Ansprechpartner entfernen',
                    handler: this.onDeleteRecords,
                    disabled: false,
                    iconCls: 'action_delete',
                    scope: this
                })
            ]
        });
        
        //this.actionToolbarItems = this.getToolbarItems();
        me.gridConfig.columns = me.getColumns();
        me.initFilterToolbar();
        
        me.plugins = me.plugins || [];
        me.plugins.push(me.filterToolbar);
        me.action_addContact = new Ext.Action({
            actionType: 'add',
            handler: me.addContact,
            iconCls: 'actionAdd',
            scope: me
        });
        me.on('afterrender', this.onAfterRender, this);
        Tine.Addressbook.ContactPersonGridPanel.superclass.initComponent.call(this);
        /*me.pagingToolbar.add(
				 '->'
		);
		this.pagingToolbar.add(
			 Ext.apply(new Ext.Button(this.action_addContact), {
				 text: 'Ansprechpartner hinzufügen',
		         scale: 'small',
		         rowspan: 2,
		         iconAlign: 'left'
		     }
		));*/
    },
    initFilterToolbar: function() {
		//var quickFilter = [new Tine.widgets.grid.FilterToolbarQuickFilterPlugin()];
                if(this.filterToolbar) {
                    return;
                }
                
        this.filterToolbar = new Tine.widgets.grid.FilterToolbar({
            app: this.app,
            filterModels: Tine.Addressbook.Model.ContactPerson.getFilterModel(),
            defaultFilter: 'query',
            filters: [{field:'query',operator:'contains',value:''}],
            plugins: []
        });
    },  
    addContact: function(){
		this.addContactWin = Tine.Addressbook.ContactPersonEditDialog.openWindow({
			contactRecord: this.contactRecord
		});
		this.addContactWin.on('beforeclose',this.onUpdateContact,this);
    },
    loadContact: function( contactRecord ){
    	this.contactRecord = contactRecord;
    	this.store.reload();
    },
    onStoreBeforeload: function(store, options) {
    	Tine.Addressbook.ContactPersonGridPanel.superclass.onStoreBeforeload.call(this, store, options);
    	if(!this.inDialog){
    		return true;
    	}
    	delete options.params.filter;
    	options.params.filter = [];
    	if(!this.contactRecord || this.contactRecord.id == 0){
    		this.store.removeAll();
    		return false;
    	}
    	var filter = {	
			field:'contact_id',
			operator:'AND',
			value:[{
				field:'id',
				operator:'equals',
				value: this.contactRecord.get('id')}]
		};
        options.params.filter.push(filter);
    },
    
    /**
     * Get the specified columns for this grid
     *
     * @return {Array} Array of columns
     */
    getColumns: function() {
        var me = this;
        return [
            { id: 'contact_person_salutation', header: me.app.i18n._('Anrede'), dataIndex: 'salutation_id', renderer: Tine.Addressbook.renderer.salutation },
            { id: 'contact_person_title', header: me.app.i18n._('Titel'), dataIndex: 'n_prefix', renderer: Tine.Addressbook.renderer.title  },
            { id: 'contact_person_firstname', header: me.app.i18n._('Vorname'), dataIndex: 'n_given' },
            { id: 'contact_person_lastname', header: me.app.i18n._('Nachname'), dataIndex: 'n_family' },
            { id: 'contact_person_org_unit', header: me.app.i18n._('Funktion'), dataIndex: 'org_unit' },
            { id: 'contact_person_manager_kind', header: me.app.i18n._('Art Entscheider'), dataIndex: 'manager_kind' },
            { id: 'contact_person_phone', header: me.app.i18n._('Telefon'), dataIndex: 'tel_work' },
            { id: 'contact_person_mobile', header: me.app.i18n._('Mobil'), dataIndex: 'tel_cell' },
            { id: 'contact_person_email', header: me.app.i18n._('E-Mail'), dataIndex: 'email' },
            { header: me.app.i18n._('Hauptansprechpartner'), dataIndex: 'is_main_contact_person', renderer: Tine.Addressbook.getMainContactPersonIcon }
        ];
    },
    
    /**
     * Add a new contact to this grid
     * 
     * @param {Tine.Addressbook.Model.Contact} The Contact Record
     */
    addContactPersonFromContact: function(contact){
        var me = this;
        var store = this.getStore();
        
        // Disallow self referencing
        if(contact.getId() == me.contactRecord.getId()) {
            Ext.Msg.show({
                title: 'Hinweis',
                msg: 'Sie können den Kontakt nicht selbst als Ansprechpartner hinterlegen.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO
            });
            
            return false;
        }
        
        // Contact person already exists
        if(store.find('contact_person_id', contact.getId()) > -1) {
            Ext.Msg.show({
                title:'Hinweis',
                msg: 'Dieser Kontakt wurde bereits als Ansprechpartner hinterlegt.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO
            });
            
            return false;
        }
        
        // Everything is okay, create and save the contact person
        var contactPerson = new Tine.Addressbook.Model.ContactPerson({
            contact_person_id: contact.getId(),
            contact_id: me.contactRecord.getId(),
            is_main_contact_person:false
        });
        
        Tine.Addressbook.contactPersonBackend.saveRecord(contactPerson, {
            scope: this,
            success: function() {
                me.onReloadContactPerson();
            }
        });
    },
    
    onReloadContactPerson: function(){
    	this.store.reload();
    	this.contactDialog.initRecord();
    },
	 onAfterRender: function(){
			this.initDropZone();
	    },
	    initDropZone: function(){
	    	if(!this.ddConfig){
	    		return;
	    	}
			this.dd = new Ext.dd.DropTarget(this.el, {
				scope: this,
				ddGroup     : this.ddConfig.ddGroup,
				notifyEnter : function(ddSource, e, data) {
					this.scope.el.stopFx();
					this.scope.el.highlight();
				},
				onDragOver: function(e,id){
				},
				notifyDrop  : function(ddSource, e, data){
					return this.scope.onDrop(ddSource, e, data);
					//this.scope.addRecordFromArticle(data.selections[0]);
					//this.scope.fireEvent('drop',data.selections[0]);
					return true;
				}
			});
			// self drag/drop
			this.dd.addToGroup(this.gridConfig.ddGroup);
		},
		onDrop: function(ddSource, e, data){
			switch(ddSource.ddGroup){
			// if article gets dropped in: add new receipt position
			case 'ddGroupContact':
				return this.addContactPersonFromContact(data.selections[0]);
				break;
			}
		}
});