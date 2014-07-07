/*
 * Tine 2.0
 * 
 * @package     Addressbook
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Hans-Jürgen Hartl
 * @copyright   Copyright (c) 2011 sopen GmbH <www.sopen.de>
 * @version     $Id:  $
 *
 */
 
Ext.ns('Tine.Addressbook');

Tine.Addressbook.ContactSelectionGrid = Ext.extend(Tine.Addressbook.ContactGridPanel, {
	useQuickSearchPlugin: false,
	additionalFilters: null,
    gridConfig: {
        loadMask: true,
        autoExpandColumn: 'n_fileas',
        enableDragDrop: true,
        ddGroup: 'ddGroupContact'
    },
    coFilter: null,
    initComponent: function(){
    	Tine.Addressbook.ContactSelectionGrid.superclass.initComponent.call(this);
    	this.action_addContact = new Ext.Action({
            actionType: 'edit',
            handler: this.addContact,
            text: 'Kontakt hinzufügen',
            iconCls: 'actionAdd',
            scope: this
        });
        this.addContactButton =  Ext.apply(new Ext.Button(this.action_addContact), {
			 scale: 'small',
             rowspan: 2,
             iconAlign: 'left'
        });
        this.pagingToolbar.add(
        		'->'
		);
		this.pagingToolbar.add(
				this.addContactButton
		);
    },
    addContact: function(){
    	var contactWin = Tine.Addressbook.ContactEditDialog.openWindow({
    		listeners: {
                scope: this,
                'update': function(record) {
                    this.onAddContact(record);
                }
    	/*
   
                'provideduplicates':function(ids) {
                    //this.filterByIds(ids);
                }*/
            }
		});
    },
    onAddContact: function(record){
    	var contactRaw = Ext.util.JSON.decode(record);
    	this.restrictFilterToAddedContact(contactRaw.id);
    	this.filterToolbar.deleteAllFilters();
    	//this.grid.store.reload();
    },
    restrictFilterToAddedContact: function(contactId){
    	this.coFilter = {	
			field:'id',
			operator:'equals',
			value: contactId
		};
    },
	onStoreBeforeload: function(store, options) {
		Tine.Addressbook.ContactSelectionGrid.superclass.onStoreBeforeload.call(this, store, options);
		if(this.additionalFilters){
			delete options.params.filter;
	    	options.params.filter = [];
			
			if(typeof(this.additionalFilters)=='array'){
				options.params.filter = options.params.filter.concat(this.additionalFilters);
			}else{
				options.params.filter.push(this.coFilter);
			}
		}else{
			if(this.coFilter){
	    		delete options.params.filter;
	        	options.params.filter = [];
				options.params.filter.push(this.coFilter);
				this.coFilter = null;
			}else{
				return true;
			}
		}
		
		
    }
});

Ext.reg('contactselectiongrid',Tine.Addressbook.ContactSelectionGrid);


Tine.Addressbook.ContactSimpleGrid = Ext.extend(Tine.Addressbook.ContactGridPanel, {
	stateFull: true,
	useQuickSearchPlugin: false,
	additionalFilters: null,
	detailsPanelCollapsedOnInit: true,
	gridConfig: {
        loadMask: true,
        autoExpandColumn: 'n_fileas',
        enableDragDrop: true,
        ddGroup: 'ddGroupContact'
    },
    coFilter: null,
    initComponent: function(){
    	/*this.app = Tine.Tinebase.appMgr.get('Addressbook');
    	Tine.Addressbook.ContactSimpleGrid.superclass.initComponent.call(this);
    	*/
    	this.app = Tine.Tinebase.appMgr.get('Addressbook');
	 this.recordProxy = Tine.Addressbook.contactBackend;
     
     this.gridConfig.cm = this.getColumnModel();
     
     Tine.Addressbook.ContactGridPanel.superclass.initComponent.call(this);
    },
    setContactIds: function(ids){
    	this.contactIds = ids;
    },
    restrictFilterToContacts: function(){
    	this.coFilter = {	
			field:'id',
			operator:'in',
			value: this.contactIds
		};
    },
   onStoreBeforeload: function(store, options) {
		Tine.Addressbook.ContactSimpleGrid.superclass.onStoreBeforeload.call(this, store, options);
		if(this.additionalFilters){
			delete options.params.filter;
	    	options.params.filter = [];
			
			if(typeof(this.additionalFilters)=='array'){
				options.params.filter = options.params.filter.concat(this.additionalFilters);
			}else{
				options.params.filter.push(this.coFilter);
			}
		}else{
			if(this.coFilter){
	    		delete options.params.filter;
	        	options.params.filter = [];
				options.params.filter.push(this.coFilter);
				//this.coFilter = null;
			}else{
				return true;
			}
		}
		
		
    }
});

Ext.reg('contactsimplegrid',Tine.Addressbook.ContactSelectionGrid);
