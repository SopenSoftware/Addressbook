Ext.ns('Tine.Addressbook.Custom');

Tine.Addressbook.Custom.getContactRecordPicker = function(id, config){
	if(!id){
		id = 'contactEditorField';
	}
	
	var obj = {
		id:id,
		disabledClass: 'x-item-disabled-view',
		recordClass: Tine.Addressbook.Model.Contact,
	    allowBlank:false,
	    autoExpand: true,
	    triggerAction: 'all',
	    selectOnFocus: true,
	    itemSelector: 'div.search-item',
	    sortField: 'n_family',
	    addressbookFilter: null,
	    displayFunc: 'getQualifiedTitle',
	    appendFilters:[],
	    onBeforeQuery: function(qevent){
	    	this.store.baseParams.filter = [
	    	       {field: 'query', operator: 'contains', value: qevent.query }                                
	    	];
	    	if(this.addressbookFilter){
	    		
	    		 this.store.baseParams.filter.push({field: 'container_id', operator: 'equals', value: this.addressbookFilter });
	    	}
	    	this.store.baseParams.filter = this.store.baseParams.filter.concat(this.appendFilters);
	    	this.store.baseParams.sort = this.sortField;
	    	this.store.baseParams.dir = 'ASC';
	    },
	    onBeforeLoad: function(store, options) {
	        options.params.paging = {
                start: options.params.start,
                limit: options.params.limit
            };
	        options.params.sort = this.sortField;
	        options.params.dir = 'ASC';
	        options.params.paging.sort = this.sortField;
		    options.params.paging.dir = 'ASC';
	    },
	    tpl: new Ext.XTemplate(
            '<tpl for="."><div class="search-item">',
                '<table cellspacing="0" cellpadding="2" border="0" style="font-size: 11px;" width="100%">',
                    '<tr>',
                        '<td width="30%"><b>{[this.encode(values.n_fileas)]}</b><br/>{[this.encode(values.org_name)]}</td>',
                        '<td width="25%">{[this.encode(values.adr_one_street)]}<br/>',
                            '{[this.encode(values.adr_one_postalcode)]} {[this.encode(values.adr_one_locality)]}</td>',
                        '<td width="25%">{[this.encode(values.tel_work)]}<br/>{[this.encode(values.tel_cell)]}</td>',
                        '<td width="20%">',
                            '<img width="45px" height="39px" src="{jpegphoto}" />',
                        '</td>',
                    '</tr>',
                '</table>',
            '</div></tpl>',
            {
                encode: function(value) {
                     if (value) {
                        return Ext.util.Format.htmlEncode(value);
                    } else {
                        return '';
                    }
                }
            }
        )
	};
	Ext.apply(obj,config);
	return new Tine.Tinebase.widgets.form.RecordPickerComboBox(obj);
};

Tine.Addressbook.Custom.getContactPersonRecordPicker = function(id, config){
	if(!id){
		id = 'contactPersonEditorField';
	}
	
	var obj = {
		id:id,
		disabledClass: 'x-item-disabled-view',
		recordClass: Tine.Addressbook.Model.ContactPerson,
	    allowBlank:false,
	    autoExpand: true,
	    triggerAction: 'all',
	    selectOnFocus: true,
	    itemSelector: 'div.search-item',
	    sortField: 'name',
	    contactRecord: null,
	    //displayFunc: 'getQualifiedTitle',
	    appendFilters:[],
	    setContactRecord: function(rec){
	    	this.contactRecord = rec;
	    	this.setValue(null);
	    	//this.store.removeAll();
	    	this.store.reload();
	    },
	    onBeforeQuery: function(qevent){
	    	this.store.baseParams.filter = [
	    	       {field: 'query', operator: 'contains', value: qevent.query }                                
	    	];
	    	if(this.contactRecord){
	    		var contactFilter = filter = {	
	    			field:'contact_id',
	    			operator:'AND',
	    			value:[{
	    				field:'id',
	    				operator:'equals',
	    				value: this.contactRecord.get('id')}]
	    		};
	    	this.store.baseParams.filter.push(contactFilter);
	    	}
	    	
	    	this.store.baseParams.filter = this.store.baseParams.filter.concat(this.appendFilters);
	    	this.store.baseParams.sort = this.sortField;
	    	this.store.baseParams.dir = 'ASC';
	    },
	    onBeforeLoad: function(store, options) {
	        options.params.paging = {
                start: options.params.start,
                limit: options.params.limit
            };
	        options.params.sort = this.sortField;
	        options.params.dir = 'ASC';
	        options.params.paging.sort = this.sortField;
		    options.params.paging.dir = 'ASC';
	    },
	    tpl: new Ext.XTemplate(
            '<tpl for="."><div class="search-item">',
                '<table cellspacing="0" cellpadding="2" border="0" style="font-size: 11px;" width="100%">',
                    '<tr>',
                        '<td width="30%"><b>{[this.encode(values.name)]}</b><br/>{[this.encode(values.unit)]}</td>',
                        '<td width="25%">{[this.encode(values.role)]}</td>',
                    '</tr>',
                '</table>',
            '</div></tpl>',
            {
                encode: function(value) {
                     if (value) {
                        return Ext.util.Format.htmlEncode(value);
                    } else {
                        return '';
                    }
                }
            }
        )
	};
	Ext.apply(obj,config);
	return new Tine.Tinebase.widgets.form.RecordPickerComboBox(obj);
};


Tine.Addressbook.Custom.getRecordPicker = function(modelName, id, config){
	switch(modelName){
	case 'Contact':
		return Tine.Addressbook.Custom.getContactRecordPicker(id, config);
	case 'ContactPerson':
		return Tine.Addressbook.Custom.getContactPersonRecordPicker(id, config);
	default:
		throw 'No matching model given';
	}
};