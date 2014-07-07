Tine.Addressbook.SCrmPanel = function(config) {
    Ext.apply(this, config);
    
    
    Tine.Addressbook.SCrmPanel.superclass.constructor.call(this);
};

/* this.scrmPanel = {
xtype: 'panel',
title: 'Merkmale',
frame:true,
border:false,
items:[
{
    xtype: 'columnform',
    autoScroll:true,
	items:[[
{
xtype:'multicriteriaselector',
region:'center',
title:'Branchenfokus',
recordPopulator: this,
height:300,
columnWidth:0.32,
id: 'tine-scrm-multiple-criteria-selector-branch-fokus',
app: Tine.Tinebase.appMgr.get('Addressbook'),
frame:true,
border:false,
recordProxy: Tine.Addressbook.contactMultipleCriteriaBackend,
recordClass: Tine.Addressbook.Model.ContactMultipleCriteria,
foreignKey: 'contact_id',
refForeignKey: 'id',
categoryKey: 'SCRM_BRANCHFOCUS'
},{
xtype:'multicriteriaselector',
region:'center',
title:'Themenfokus',
recordPopulator: this,
height:300,
columnWidth:0.32,
id: 'tine-scrm-multiple-criteria-selector-theme-fokus',
app: Tine.Tinebase.appMgr.get('Addressbook'),
frame:true,
border:false,
recordProxy: Tine.Addressbook.contactMultipleCriteriaBackend,
recordClass: Tine.Addressbook.Model.ContactMultipleCriteria,
foreignKey: 'contact_id',
refForeignKey: 'id',
categoryKey: 'SCRM_THEMEFOCUS'
},{
xtype:'multicriteriaselector',
region:'center',
title:'Zielgruppen-Fokus',
recordPopulator: this,
height:300,
columnWidth:0.32,
id: 'tine-scrm-multiple-criteria-selector-emo-fokus',
app: Tine.Tinebase.appMgr.get('Addressbook'),
frame:true,
border:false,
recordProxy: Tine.Addressbook.contactMultipleCriteriaBackend,
recordClass: Tine.Addressbook.Model.ContactMultipleCriteria,
foreignKey: 'contact_id',
refForeignKey: 'id',
categoryKey: 'SCRM_TARGETGROUPFOCUS'
}


]]}]
		
	
};*/ 

Ext.extend(Tine.Addressbook.SCrmPanel, Ext.Panel, {
	layout:'column',
	frame:false,
	border:false,
	anchor:'100%',
	widgetHeight:200,
	widgetWidth:300,
	autoScroll:true,
	recordPopulator: null,
	initComponent: function(){
		this.selectors = new Ext.util.MixedCollection();
        this.items = this.getItems();
		Tine.Addressbook.SCrmPanel.superclass.initComponent.call(this);
		
	},
	setRecordPopulator: function(recordPopulator){
		this.recordPopulator = recordPopulator;
		
		this.selectors.each(
			function(item){
				this.getSelectorById(item).setRecordPopulator(this.getRecordPopulator());
			},this
		);
	},
	getSelectorById: function(id){
		if(!this.selectors.contains(id)){
			throw 'Selector unknown';
		}
		return Ext.getCmp(id);
	},
	getRecordPopulator: function(){
		return this.recordPopulator;
	},
	getItems: function(){
		// grab all categories from registry
		var cats = Tine.SCrm.getCriteriaCategoryDefinitionFromRegistry();
		
		var categories = new Ext.util.MixedCollection();
		categories.addAll(cats);
		
		var result = {
			items: [],
			keys: [],
			config:{
				height: this.widgetHeight,
				width: this.widgetWidth,
				recordPopulator: this.recordPopulator
			}
		};
		console.log('result-config');
		console.log(result);
		
		categories.each(function(item){
			var name = item.name;
			var key = item.key;
			var selector = {
				xtype:'multicriteriaselector',
				region:'center',
				title:name,
				recordPopulator: this.config.recordPopulator,
				height:this.config.height,
				width:this.config.width,
				//columnWidth:0.32,
				id: 'tine-scrm-multiple-criteria-selector-' + key,
				app: Tine.Tinebase.appMgr.get('Addressbook'),
				frame:true,
				border:false,
				recordProxy: Tine.Addressbook.contactMultipleCriteriaBackend,
				recordClass: Tine.Addressbook.Model.ContactMultipleCriteria,
				foreignKey: 'contact_id',
				refForeignKey: 'id',
				categoryKey: key
			};
			this.items.push(selector);
			this.keys.push(selector.id);
		}, result);
		
		this.selectors = new Ext.util.MixedCollection();
		this.selectors.addAll(result.keys);
		
		return [result.items];
		
		
		
		
	}
});