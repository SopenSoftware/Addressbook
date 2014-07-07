Ext.namespace('Tine.Addressbook');

Tine.Addressbook.PrintContactDialog = Ext.extend(Ext.Panel, {
	windowNamePrefix: 'PrintContactWindow_',
	//mode: 'local',
	appName: 'Addressbook',
	layout:'border',
	//recordClass: Tine.Membership.Model.SoMember,
	predefinedFilter: null,

	grid: null,
	actionType: 'printMultiLetter',
	/**
	 * initialize component
	 */
	initComponent: function(){
		this.title = this.initialConfig.panelTitle;
		this.actionType = this.initialConfig.actionType;
		this.initActions();
		this.initToolbar();
		this.items = this.getFormItems();
		this.on('afterrender',this.onAfterRender,this);
		Tine.Addressbook.PrintContactDialog.superclass.initComponent.call(this);
	},

	initActions: function(){
        this.actions_print = new Ext.Action({
            text: 'Ok',
            disabled: false,
            iconCls: 'action_applyChanges',
            handler: this.doCall,
            scale:'small',
            iconAlign:'left',
            scope: this
        });
        this.actions_cancel = new Ext.Action({
            text: 'Abbrechen',
            disabled: false,
            iconCls: 'action_cancel',
            handler: this.cancel,
            scale:'small',
            iconAlign:'left',
            scope: this
        });        
	},
	doCall: function(){
		switch(this.actionType){
		case 'printMultiLetter':
			this.printMultiLetter();
			break;
		}
	},
	/**
	 * init bottom toolbar
	 */
	initToolbar: function(){
		this.bbar = new Ext.Toolbar({
			height:48,
        	items: [
        	        '->',
                    Ext.apply(new Ext.Button(this.actions_cancel), {
                        scale: 'medium',
                        rowspan: 2,
                        iconAlign: 'left',
                        arrowAlign:'right'
                    }),
                    Ext.apply(new Ext.Button(this.actions_print), {
                        scale: 'medium',
                        rowspan: 2,
                        iconAlign: 'left',
                        arrowAlign:'right'
                    })
                ]
        });
	},
	onAfterRender: function(){
		if(this.textEditable){
			this.templateSelector.on('select', this.onSelectTemplate, this);
			this.templateSelector.on('change', this.onSelectTemplate, this);
			
		}else{
			
		}
		
	},
	onSelectTemplate: function(){
		this.requestTemplateVars();
	},
	renderTextBlockEditors: function(results){
		
		this.editorContainer.doLayout();
		var formField;
		this.editorContainer.removeAll();
		var fields = [];
		this.formFieldMap = new Ext.util.MixedCollection();
		var id;
		for(var i in results){
			if(results[i] && results[i].name){
				id = 'editor_' + results[i].name;
				formField = new Ext.form.TextArea({
	    			columnWidth: 0.9,
	    			name: results[i].name,
	    			id: id,
	    			height: 120,
	    			fieldLabel: results[i].name,
	    			value: results[i].data
	    		});
				fields.push(formField);
				this.formFieldMap.add(id, results[i].name);
			}
    	}
		var newForm = {xtype:'columnform', items:[fields]};
		
		
		this.editorContainer.add(newForm);
		
		this.editorContainer.show();
		this.editorContainer.expand();
		this.editorContainer.doLayout();
		//newForm.doLayout();
		
		
		//newForm.doLayout();
		
		//this.editorContainer.doLayout();
		//this.doLayout();
		//Ext.getCmp('contentPanel').doLayout();
		
		
		//Ext.getCmp('contentContainer').doLayout();
		
		
	},
	requestTemplateVars: function(){
		var templateId = this.templateSelector.getValue();
		Ext.Ajax.request({
            scope: this,
            params: {
                method: 'DocManager.getTextBlocks',
                templateId: templateId
            },
            success: function(response){
            	var results = Ext.util.JSON.decode(response.responseText);
            	this.renderTextBlockEditors(results);
            	
        	},
        	failure: function(response){
        		var result = Ext.util.JSON.decode(response.responseText);
        		Ext.Msg.alert(
        			'Fehler', 
                    'Die erforderlichen Daten können nicht abgefragt werden' + result
                );
        	}
        });
	},

	/**
	 * save the order including positions
	 */
	printMultiLetter: function(){
		var filterValue = Ext.util.JSON.encode(this.predefinedFilter);
		var templateId = Ext.getCmp('multiletter_letter_template').getValue();
		
		if(this.textEditable){
			//var formFields = this.getForm().getFields();
			var data = {};
			this.formFieldMap.eachKey(function(id,name){
				this[name] = Ext.getCmp(id).getValue();
			},data); 
			
//			var win = window.open(
//					Sopen.Config.runtime.requestURI + '?method=Addressbook.printMultiLetter&filters='+filterValue+'&templateId='+templateId+'&data='+Ext.util.JSON.encode([data]),
//					"membersPDF",
//					"menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes"
//			);
			
			var downloader = new Ext.ux.file.Download({
				params: {
	                method: 'Addressbook.printEditableLetter',
	                requestType: 'HTTP',
	                filters: filterValue,
	                templateId: templateId,
	                data: Ext.util.JSON.encode(data)
	            }
	        }).start();
			
		}else{
			
			var win = window.open(
					Sopen.Config.runtime.requestURI + '?method=Addressbook.printMultiLetter&filters='+filterValue+'&templateId='+templateId+'&preview=0',
					"membersPDF",
					"menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes"
			);
			
		}
		

//		
//		var downloader = new Ext.ux.file.Download({
//            params: {
//                method: 'Addressbook.printMultiLetter',
//                requestType: 'HTTP',
//                filters: filterValue,
//                templateId: templateId,
//                preview: 0
//            }
//        }).start();
	},
//	customExport: function(){
//		var filters = this.filterPanel.getValue();
//		filters = filters.concat(this.customExportDefinition.filters);
//		var filterValue = Ext.util.JSON.encode(filters);
//		var exportClassName = this.customExportDefinition.exportClassName;
//		
//		var downloader = new Ext.ux.file.Download({
//            params: {
//                method: 'Membership.exportMembersAsCustomCsv',
//                requestType: 'HTTP',
//                filters: filterValue,
//                exportClassName: exportClassName
//            }
//        }).start();
//	},
	
	/**
	 * Cancel and close window
	 */
	cancel: function(){
		this.purgeListeners();
        this.window.close();
	},
	/**
	 * Get form items of subclass
	 */
	getAdditionalFormItems: function(){
		return [];
	},
	
	onLoadDocParts: function(){
		
	},
	/**
	 * returns dialog
	 * 
	 * NOTE: when this method gets called, all initalisation is done.
	 */
	getFormItems: function() {
		// use some fields from brevetation edit dialog
//		var formItems = [
//		                 //type:'hidden',id:'filters', name:'filters', width:1}
//		];
//		formItems = formItems.concat(this.getAdditionalFormItems());
		
		
		this.templateSelector = new Tine.Tinebase.widgets.form.RecordPickerComboBox({
		    fieldLabel: 'Vorlage',
		    height:40,
		    id: 'multiletter_letter_template',
		    blurOnSelect: true,
		    allowBlank:false,
		    recordClass: Tine.DocManager.Model.Template,
		    width: 400
		});
		
		this.editorContainer = new Ext.form.FormPanel({
			region:'south',
			frame:false,
			title:'Dokument schreiben',
			collapsed:true,
			//hidden:true,
			forceLayout:true,
			autoScroll:true,
			items:[
			       {xtype:'hidden', name:'initial'}
			]
		});
		
		var panel = new Ext.Panel({
	        id: 'contentPanel',
			border: false,
	        region:'center',
	        frame:true,
	        items:[
	            this.templateSelector,
	            this.editorContainer
	        ]
	    });

//		if(this.predefinedFilter == null){
//			this.predefinedFilter = [];
//		}
//		this.filterPanel = new Tine.widgets.form.FilterFormField({
//			 	id:'fp',
//		    	filterModels: Tine.Addressbook.Model.Contact.getFilterModel(),
//		    	defaultFilter: 'query',
//		    	filters:this.predefinedFilter
//		});
		 
		return panel;
		
		var wrapper = {
			id: 'contentContainer',
			xtype: 'panel',
			layout: 'border',
			frame: true,
			items: [
			   panel//,
//			   {
//				   xtype:'panel',
//				   layout:'border',
//				   region:'center',
//				   items:[
//						{
//							xtype: 'panel',
//							title: 'Selektion Kontakte',
//							height:200,
//							id:'filterPanel',
//							region:'center',
//							autoScroll:true,
//							items: 	[this.filterPanel]
//						}   
//				   ]
//			   }
			   
			]
		
		};
		return wrapper;
	}
});

/**
 * Membership Edit Popup
 */
Tine.Addressbook.PrintContactDialog.openWindow = function (config) {
    // TODO: this does not work here, because of missing record
	record = {};
	var id = (config.record && config.record.id) ? config.record.id : 0;
    var window = Tine.WindowFactory.getWindow({
        width: 650,
        height: 400,
        name: Tine.Addressbook.PrintContactDialog.prototype.windowNamePrefix + id,
        contentPanelConstructor: 'Tine.Addressbook.PrintContactDialog',
        contentPanelConstructorConfig: config
    });
    return window;
};