Tine.Addressbook.DuplicateCheckWidget = function(config) {
    Ext.apply(this, config);
    
    
    Tine.Addressbook.DuplicateCheckWidget.superclass.constructor.call(this);
};

Ext.extend(Tine.Addressbook.DuplicateCheckWidget, Ext.Panel, {
	layout:'fit',
	frame:true,
	initComponent: function(){
		this.addEvents(
			'duplicatesfound',
			'noduplicatesfound',
			'duplicatecheckfailed',
			'recordselect',
			'ignoreduplicates',
			'respectduplicates'
		),
		this.duplicateGrid = new Tine.Addressbook.ContactSimpleGrid({
			title:'mögliche Duplikate',
			stateId: 'addressbook-dialog-duplicate-check-duplicate-contacts-grid',
			useFilterToolbar:false,
			usePagingToolbar:false,
			layout:'fit'
		});
        this.items = this.getItems();
		Tine.Addressbook.DuplicateCheckWidget.superclass.initComponent.call(this);
		
	},
	checkForDuplicates: function(recordData, adding){
		this.adding = adding;
		Ext.Ajax.request({
            scope: this,
            success: this.onCheckForDuplicates,
            params: {
                method: 'Addressbook.checkDuplicate',
                recordData: Ext.util.JSON.encode(recordData)
            },
            failure: this.onCheckForDuplicatesFailed
        });
	},
	onCheckForDuplicates: function(response){
		var result = Ext.util.JSON.decode(response.responseText);
    	
		if(result.success==true){
			
			var count = result.count;
			
			if(count>0){
				
				this.fireEvent('duplicatesfound', count, result.ids, this);
				
				var ids = result.duplicateIds
				this.duplicateGrid.setContactIds(ids);
				this.duplicateGrid.restrictFilterToContacts();
				this.duplicateGrid.refresh();
				if(this.adding){
					this.adding = false;
					Ext.MessageBox.show({
			             title: 'Kontakt bereits vorhanden', 
			             msg: 'Der Kontakt scheint bereits ' + result.count + ' mal vorhanden zu sein.<br />Soll er dennoch neu erfasst werden?',
			             buttons: Ext.Msg.YESNO,
			             scope: this,
			             fn: this.onAnswerDuplicateQuestion,
			             icon: Ext.MessageBox.QUESTION
			         });
				}else{
					Ext.MessageBox.show({
			             title: 'Duplikate gefunden', 
			             msg: 'Der Kontakt scheint ' + result.count + ' mal vorhanden zu sein.',
			             buttons: Ext.Msg.OK,
			             scope: this,
			             icon: Ext.MessageBox.INFO
			         });
				}
			}else{
				
				this.fireEvent('noduplicatesfound', count, result.ids, this);
				
			}
		}else{
			this.onCheckForDuplicatesFailed();
		}
	},
	onAnswerDuplicateQuestion: function(btn, text){
		if(btn == 'yes'){
			this.fireEvent('ignoreduplicates', this);
			//this.finalizeApply(this.bufferIntermediateApply.params.button, this.bufferIntermediateApply.params.event, this.bufferIntermediateApply.params.closeWindow);
		}else{
			this.fireEvent('respectduplicates', this);
			/*if(this.bufferIntermediateApply.result.count>1){
				this.fireEvent('provideduplicates', this.bufferIntermediateApply.result.duplicateIds)
			}else{
				this.loadRecordById(this.bufferIntermediateApply.result.duplicateIds[0]);
			}*/
		}
	},
	onCheckForDuplicatesFailed: function(response){
		this.fireEvent('duplicatecheckfailed',this);
		Ext.MessageBox.show({
            title: 'Fehler', 
            msg: 'Die Duplikatprüfung konnte nicht durchgeführt werden.',
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.WARNING
        });
	},
	getItems: function(){
		return [this.duplicateGrid];
	}
});