Ext.ns('Tine.Addressbook');

Tine.Addressbook.ContactRelationDescriptorSelect = Ext.extend(Ext.form.ComboBox, {
    
    /**
     * @cfg {Ext.data.DataProxy} recordProxy
     */
    recordProxy: Tine.Addressbook.contactRelationDescriptorBackend,
    /**
     * @cfg {bool} blurOnSelect blurs combobox when item gets selected
     */
    blurOnSelect: false,
    /**
     * @cfg {Object} defaultPaging 
     */
    defaultPaging: {
        start: 0,
        limit: 50
    },
    
    /**
     * @property {Tine.Addressbook.Model.Contact} record
     */
    record: null,
    
    itemSelector: 'div.search-item',
    typeAhead: false,
    minChars: 3,
    pageSize:10,
    forceSelection: true,
    displayField: 'displaytitle',
    triggerAction: 'all',
    selectOnFocus: true,
    
    /**
     * @private
     */
    initComponent: function() {
        this.app = Tine.Tinebase.appMgr.get('Addressbook');
        
        this.store = new Ext.data.Store({
            fields: Tine.Addressbook.Model.ContactRelationDescriptorArray.concat({name: 'displaytitle'}),
            proxy: this.recordProxy,
            reader: this.recordProxy.getReader(),
            remoteSort: true,
            sortInfo: {field: 'id', dir: 'ASC'},
            listeners: {
                scope: this,
                //'update': this.onStoreUpdate,
                'beforeload': this.onStoreBeforeload
            }
        });
        this.tpl = new Ext.XTemplate(
            '<tpl for="."><div class="search-item">',
                '<span>' +
                    '{[this.encode(values.name)]} #{[this.encode(values.key)]}' +
                '</span>' +
                '{[this.encode(values.description)]}' +
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
        );
        
        Tine.Addressbook.ContactRelationDescriptorSelect.superclass.initComponent.call(this);
        
        if (this.blurOnSelect){
            this.on('select', function(){
                this.fireEvent('blur', this);
            }, this);
        }
    },
    
    getValue: function() {
        return this.record ? this.record.get('id') : null;
    },
    
    setValue: function(value) {
        if (value) {
            if (typeof(value.get) == 'function') {
                this.record = value;
                
            } else if (typeof(value) == 'string') {
                // NOTE: the string also could be the string for the display field!!!
                ////console.log('id');
                
            } else {
                // we try raw data
                this.record = new Tine.Addressbook.Model.ContactRelationDescriptor(value, value.id);
            }
            
            var title = this.record.getTitle();
            if (title) {
				Tine.Addressbook.ContactRelationDescriptorSelect.superclass.setValue.call(this, title);
			}
        }
    },
    
    onSelect: function(record){
        record.set('displaytitle', record.getTitle());
        this.record = record;
        
        Tine.Addressbook.ContactRelationDescriptorSelect.superclass.onSelect.call(this, record);
    },
        
    /**
     * @private
     */
    onStoreBeforeload: function(store, options) {
        options.params = options.params || {};
        
        options.params.filter = [
            {field: 'query', operator: 'contains', value: store.baseParams.query}
        ];
    }
});

Ext.reg('cr_descriptor',Tine.Addressbook.ContactRelationDescriptorSelect);

/*Tine.Addressbook.ContactGridFilter = Ext.extend(Tine.widgets.grid.FilterModel, {
    field: 'contact_id',
    valueType: 'contact',    
    
    initComponent: function() {
        Tine.widgets.tags.TagFilter.superclass.initComponent.call(this);
        
        this.app = Tine.Tinebase.appMgr.get('Addressbook');
        this.label = this.app.i18n._("Time Account");
        this.operators = ['equals'];
    },
   
    valueRenderer: function(filter, el) {
        // value
        var value = new Tine.Addressbook.ContactSelect({
            filter: filter,
            blurOnSelect: true,
            width: 200,
            listWidth: 500,
            id: 'tw-ftb-frow-valuefield-' + filter.id,
            value: filter.data.value ? filter.data.value : this.defaultValue,
            renderTo: el
        });
        value.on('specialkey', function(field, e){
             if(e.getKey() == e.ENTER){
                 this.onFiltertrigger();
             }
        }, this);
        //value.on('select', this.onFiltertrigger, this);
        
        return value;
    }
});*/