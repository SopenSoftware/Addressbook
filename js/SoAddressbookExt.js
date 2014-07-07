
Ext.namespace('Tine.Addressbook');


Tine.Addressbook.Format = function (){
    var trimRe = /^\s+|\s+$/g;
    return {

/**
 * Formats the number according to the format string.
 * 
examples (123456.789): *
* 0 - (123456) show only digits, no precision
* 0.00 - (123456.78) show only digits, 2 precision
* 0.0000 - (123456.7890) show only digits, 4 precision
* 0,000 - (123,456) show comma and digits, no precision
* 0,000.00 - (123,456.78) show comma and digits, 2 precision
* 0,0.00 - (123,456.78) shortcut method, show comma and digits, 2 precision
* To reverse the grouping (,) and decimal (.) for international numbers, add /i to the end. * For example: 0.000,00/i *

 * @param {Number} v The number to format.
 * @param {String} format The way you would like to format this text.
 * @return {String} The formatted number.
 */
number: function(v, format) {
    if(!format){
        return v;
    }
    v = Ext.num(v, NaN);
    if (isNaN(v)){
        return '';
    }
    var comma = ',',
        dec = '.',
        i18n = false,
        neg = v < 0;

    v = Math.abs(v);
    if(format.substr(format.length - 2) == '/i'){
        format = format.substr(0, format.length - 2);
        i18n = true;
        comma = '.';
        dec = ',';
    }

    var hasComma = format.indexOf(comma) != -1, 
        psplit = (i18n ? format.replace(/[^\d\,]/g, '') : format.replace(/[^\d\.]/g, '')).split(dec);

    if(1 < psplit.length){
        v = v.toFixed(psplit[1].length);
    }else if(2 < psplit.length){
        throw ('NumberFormatException: invalid format, formats should have no more than 1 period: ' + format);
    }else{
        v = v.toFixed(0);
    }

    var fnum = v.toString();
    if(hasComma){
        psplit = fnum.split('.');

        var cnum = psplit[0], parr = [], j = cnum.length, m = Math.floor(j / 3), n = cnum.length % 3 || 3;

        for(var i = 0; i < j; i += n){
            if(i !== 0){
                n = 3;
            }
            parr[parr.length] = cnum.substr(i, n);
            m -= 1;
        }
        fnum = parr.join(comma);
        if(psplit[1]){
            fnum += dec + psplit[1];
        }
    }

    return (neg ? '-' : '') + format.replace(/[\d,?\.?]+/, fnum);
},
numberRenderer : function(format){
    return function(v){
        return Tine.Addressbook.Format.number(v, format);
    };
}
    };

    }();


Tine.Addressbook.formatCurrency = function(elem,value){
	Ext.getCmp(elem.id).setValue(Tine.Addressbook.Format.number(parseFloat(value),'0.00'));
};

Tine.Addressbook.onYearlyFeeChange = function(elem, value){
	Tine.Addressbook.formatCurrency(elem,value);
	Tine.Addressbook.fillFeeBalance(Ext.getCmp(elem.id).getValue());
};

/**
 * TODO HH:
 * 
 */

Tine.Addressbook.getContactContactPanel = function(contactRecord){
	var config = {
			contactRecord: contactRecord,
			followUp: true,
			followUpDirection: Tine.Addressbook.Contact.RELATION_FOLLOWUP_DIR_DOWN
	};
	return {
		title: 'Kontaktbeziehungen',
        id:'contactContactTab',
        border: false,
        frame: true,
        layout: 'border',
        items: [
            {
            	xtype:'panel',
	            layout: 'fit',
	            containsScrollbar: true,
	            autoScroll: true,
	            id: 'adbContactContact',
	            //deferredRender:false,
	            region: 'center',
	            items:  [
	                new Tine.Addressbook.ContactContactTreePanel( config )
	            ]
	        }
	    ]
	};
};

Tine.Addressbook.getContactCRMPanel = function (){

		var contactCRMMainColumnForm = {
	            xtype:'columnform',
	            id:'contactCRMCForm',
	           // deferredRender:true,
				items: [
				    [
			        	{
							fieldLabel: 'Hauptkategorie',
						    context: 'main_category_contact_id',
							xtype: 'sogenericstatefield',
							columnWidth: 0.5,
							id:'main_category_contact_id_mirror',
				            name:'main_category_contact_id',
			            	allowBlank:false,
	                        listeners:{
			        			scope:this,
			        			change: Tine.Addressbook.Listeners.mainCategoryMirrorChangeListener
			        		}
						}
			        	
			        	,
				        {
				    		columnWidth: 0.5,
				            fieldLabel: 'Alter', 
				            disabled:true,
				            id:'age',
			            	name:'age'
				        }
			       	],[
			        	{
							fieldLabel: 'Addressquelle',
						    context: 'contact_source_id',
							xtype: 'sogenericstatefield',
							columnWidth: 0.5,
							id:'contact_source_id',
				            name:'contact_source_id'
						},
				        {
				    		columnWidth: 0.5,
				            fieldLabel: 'Sternzeichen', 
				            disabled:true,
				            id:'sodiac_sign',
			            	name:'sodiac_sign'
				        }   
			       	],[
						{
							columnWidth: 0.98,
						    fieldLabel: 'Ursprung', 
						    id:'contact_source',
							name:'contact_source'
						}     
			       	]
			       	
			     ]
		};
		
		var contactCRMMainFieldSet = {
			 	xtype: 'fieldset',
			    title: '',
			    autoHeight:true,
			    defaults:{
					anchor:'-20'
				},
			    layout:'anchor',
			    items :[{
			        xtype: 'panel',
			        layout:'fit',
			        items:[
			               	contactCRMMainColumnForm
			        ]
			    }]
			};
		
		var contactCRMAffinityColumnForm = {
	            xtype:'columnform',
	            id:'contactCRMAffinityCForm',
	            //deferredRender:false,
				items: [
				    [
			        	{
			        		xtype: 'checkbox',
							boxLabel: 'Ist Werber',
							hideLabel:true,
							columnWidth: 0.5,
							id:'is_affiliator',
				            name:'is_affiliator'
						},{
			        		xtype: 'checkbox',
							boxLabel: 'wurde geworben',
							hideLabel:true,
							columnWidth: 0.5,
							id:'is_affiliated',
				            name:'is_affiliated'
						}
						
			       	],				   
			       	[
 			        	Tine.Addressbook.Custom.getRecordPicker('Contact','membership_contact_id',{
							disabledClass: 'x-item-disabled-view',
							columnWidth: 0.98,
							fieldLabel: 'Werber',
						    name:'affiliate_contact_id',
						    disabled: false,
						    blurOnSelect: true,
						    allowBlank:true,
						    ddConfig:{
					        	ddGroup: 'ddGroupContact'
					        }
						})
			       	],
			       	[
			        	{
							xtype: 'extuxclearabledatefield',
							disabledClass: 'x-item-disabled-view',
							id: 'affiliator_provision_date',
							name: 'affiliator_provision_date',
							fieldLabel: 'Ausz.datum Werberprov.',
						    columnWidth:0.4

						},{
					 		xtype: 'sopencurrencyfield',
					    	fieldLabel: 'Werberprovision', 
						    id:'affiliator_provision',
						    name:'affiliator_provision',
					    	disabledClass: 'x-item-disabled-view',
					    	blurOnSelect: true,
					 	    width:180
					 	}
			       	],[
						{
						    fieldLabel: 'Anzahl Zeitungen',
						    name: 'count_magazines',
						    xtype:'uxspinner',
						    strategy: new Ext.ux.form.Spinner.NumberStrategy({
						        incrementValue : 1,
						        allowDecimals : false
						    })
						},{
						    fieldLabel: 'Anzahl zusätzl. Zeitungen',
						    name: 'count_additional_magazines',
						    xtype:'uxspinner',
						    strategy: new Ext.ux.form.Spinner.NumberStrategy({
						        incrementValue : 1,
						        allowDecimals : false
						    })
						}      
			       	],[
						{
							xtype: 'extuxclearabledatefield',
							disabledClass: 'x-item-disabled-view',
							id: 'info_letter_date',
							name: 'info_letter_date',
							fieldLabel: 'Datum Infoschreiben',
						    columnWidth:0.4
						
						}   
			       	]
			     ]
		};
		
		var contactCRMAffinityFieldSet = {
			 	xtype: 'fieldset',
			 	collapsible:true,
			    title: 'Merkmale Werber/Werbung',
			    autoHeight:true,
			    defaults:{
					anchor:'-20'
				},
			    layout:'anchor',
			    items :[{
			        xtype: 'panel',
			        layout:'fit',
			        items:[
			               contactCRMAffinityColumnForm
			        ]
			    }]
			};
		
		var contactSCrmFieldSet = {
		 	xtype: 'fieldset',
		    title: 'Merkmale SCrm',
		    id:'contact_record_scrm_fieldset',
		    //autoHeight:true,
		    collapsible:true,
		    autoScroll:true,
		    height:220,
		    defaults:{
				anchor:'-20'
			},
		    layout:'fit',
		    items :
		    [
new Tine.Addressbook.SCrmPanel({
	id:'contact_record_scrm_panel',
	widgetHeight:190,
	widgetWidth:350
})
		    ]
		};
		
		
		var contactCRMEconomyColumnForm = {
	            xtype:'columnform',
	            id:'contactCRMEconomyCForm',
	            //deferredRender:false,
				items: [
				    [
			        	{
				    		columnwidth: 0.5,
				            fieldLabel: 'ABC-Analyse Kunde', 
				            disabled:true,
				            id:'abc_analysis',
			            	name:'abc_analysis'
						},
				        {
				    		columnwidth: 0.5,
				            fieldLabel: 'Saldo OP', 
				            disabled:true,
				            id:'saldo_op',
			            	name:'saldo_op'
				        }
			       	],
				    [
				        {
				    		columnwidth: 0.5,
				            fieldLabel: 'Umsatz letztes Jahr', 
				            disabled:true,
				            id:'turnover_last_year',
			            	name:'turnover_last_year'
				        } ,
			        	{
				    		columnwidth: 0.5,
				            fieldLabel: 'Umsatz aktuelles Jahr', 
				            disabled:true,
				            id:'turnover_year',
			            	name:'turnover_year'
						}
			       	],[
				        {
			    			xtype: 'checkbox',
			    			id: 'ksk',
			    			name: 'ksk',
				        	hideLabel:true,
				            boxLabel: 'KSK'
					     }
			       	]
			  ]
		};
		
		
		var contactCRMEconomyFieldSet = {
			 	xtype: 'fieldset',
			    title: 'Merkmale betriebswirtschaftlich',
			    collapsible:true,
			    collapsed:true,
			    autoHeight:true,
			    defaults:{
					anchor:'-20'
				},
			    layout:'anchor',
			    items :[{
			        xtype: 'panel',
			        layout:'fit',
			        items:[
			               contactCRMEconomyColumnForm
			        ]
			    }]
			};
		
		return new Ext.Panel({
			title: 'CRM',
			forceLayout:true,
            id:'contactCRMEditTab',
            deferLayout:false,
            border: false,
            frame: true,
            layout: 'border',
            //deferredRender:true,
	        items: [
	            {
	            	xtype:'panel',
		            layout: 'hfit',
		            containsScrollbar: true,
		            autoScroll: true,
		            id: 'adbContactCRMEdit',
		            region: 'center',
		            items:  [
		                contactCRMMainFieldSet,
		                contactSCrmFieldSet,
		                contactCRMAffinityFieldSet,
		                contactCRMEconomyFieldSet
		            ]
		        }
		    ]
		});
};

/**
 * Sopen extension for addressbook editdialog
 * Banking data tab panel
 * HH: 2009-07-17
 */
Tine.Addressbook.getBankingDataPanel = function(){
	return {
		deferredRender:false,
	    xtype: 'columnform',
	    title: 'Bankverbindung',
	    labelAlign: 'top',
	    formDefaults: {
	        xtype:'textfield',
	        anchor:'100%',
	        labelSeparator: ''
	    },
	    items: [
	         [
	            { columnWidth: 0.45,fieldLabel: 'Kontonummer', id:'bank_account_number', name:'bank_account_number'},
	            { columnWidth: 0.45,fieldLabel: 'BLZ', id:'bank_code', name:'bank_code'}
	         ],
	         [
              	{ columnWidth: 0.45,fieldLabel: 'Kontoinhaber', id:'bank_account_name', name:'bank_account_name'},
              	//{ columnWidth: 0.3,fieldLabel: 'Bank', id:'bank_name', name:'bank_name'}  
              	{
	              	xtype:'combo',
	              	columnWidth: 0.45,
	            	hideTrigger:true,
	            	store:[],
	            	fieldLabel: 'Bank',
	                id:'bank_name',
	                name:'bank_name'
              	}
	         ]                    
	    ]
	};
};
 
Tine.Addressbook.getAddressSelectionRadioGroups = function(){
	
	var adCheckboxes = new Ext.form.RadioGroup({
	    id:'addressUsage',
	    xtype: 'radiogroup',
	    itemCls: 'x-check-group',
	    columns: 5,
	    style:{
			'z-index':10000
		},
	    defaults:{
			align:'center', 
			width: 400
		},
	    items: [
	        {xtype:'textfield', width:500,disabled:true, name:'blanko',value:'',style:'background:transparent;border:none;color:#000000;z-index:10001'},
            {xtype:'textfield', width:500,disabled:true, value:'Briefanschrift', name: 'brief',style:'background:transparent;border:none;color:#000000;z-index:10001'},
            {xtype:'textfield', width:500,disabled:true, value:'Lieferanschrift', name: 'brief1',style:'background:transparent;border:none;color:#000000;z-index:10001'},
            {xtype:'textfield', width:500,disabled:true, value:'Rechnungsanschrift', name: 'brief2',style:'background:transparent;border:none;color:#000000;z-index:10001'},
            {xtype:'textfield', width:500,disabled:true, value:'Angebotsanschrift', name: 'brief6',style:'background:transparent;border:none;color:#000000;z-index:10001'},
            {xtype:'textfield', width:500,disabled:true, height:22,  value:'Adresse 1 ist:', name: 'brief3',style:'background:transparent;border:none;color:#000000;z-index:10001'},
	        {xtype:'radio', name: 'letter_address', id:'busy_letter', inputValue:'true',checked:true,style:'z-index:10001'},
	        {xtype:'radio', name: 'shipping_address',id:'busy_shipping', inputValue:'true',checked:true,style:'z-index:10001'},
	        {xtype:'radio', name: 'invoice_address', id:'busy_invoice',inputValue:'true',checked:true,style:'z-index:10001'},
	        {xtype:'radio', name: 'order_address', id:'busy_order',inputValue:'true',checked:true,style:'z-index:10001'},
	        {xtype:'textfield', disabled:true, height:22, value:'Adresse 2 ist:', name: 'brief4',style:'background:transparent;border:none;color:#000000;'},
	        {xtype:'radio', name: 'letter_address', id:'private_letter',checked:false,style:'z-index:10001'},
	        {xtype:'radio', name: 'shipping_address', id:'private_shipping',checked:false,style:'z-index:10001'},
	        {xtype:'radio', name: 'invoice_address', id:'private_invoice',checked:false,style:'z-index:10001'},
	        {xtype:'radio', name: 'order_address', id:'private_order',checked:false,style:'z-index:10001'},
	        {xtype:'textfield', disabled:true, height:22, value:'Adresse 3 ist:', name: 'brief5',style:'background:transparent;border:none;color:#000000;'},
	        {xtype:'radio', name: 'letter_address', id:'adr3_letter',checked:false,style:'z-index:10001'},
	        {xtype:'radio', name: 'shipping_address', id:'adr3_shipping',checked:false,style:'z-index:10001'},
	        {xtype:'radio', name: 'invoice_address', id:'adr3_invoice',checked:false,style:'z-index:10001'},
	        {xtype:'radio', name: 'order_address', id:'adr3_order',checked:false,style:'z-index:10001'},
	        {xtype:'textfield', disabled:true, height:22, value:'Adresse 4 ist:', name: 'brief7',style:'background:transparent;border:none;color:#000000;'},
	        {xtype:'radio', name: 'letter_address', id:'adr4_letter',checked:false,style:'z-index:10001'},
	        {xtype:'radio', name: 'shipping_address', id:'adr4_shipping',checked:false,style:'z-index:10001'},
	        {xtype:'radio', name: 'invoice_address', id:'adr4_invoice',checked:false,style:'z-index:10001'},
	        {xtype:'radio', name: 'order_address', id:'adr4_order',checked:false,style:'z-index:10001'}
	    ]
	});
	
	return {
		id:'SoAddressUsage',
	 	xtype: 'fieldset',
	    title: 'Anschriften Verwendung',
	    autoHeight:true,
	   // layout:'hfit',
	    items :[{
	        xtype: 'panel',
	        layout:'column',
	        frame: false,
	        defaults:{
	    		width:500
	    	},
	        height: 110,
	        items:[
	         adCheckboxes       
	        ]
	    }]
	};
};

Tine.Addressbook.getSoContactTitleStore = function() {

    var costore = Ext.StoreMgr.get('AddressbookSopenExtContactTitleStore');
    
    if (!costore) {
    	costore = new Ext.data.JsonStore({
            fields: Tine.Addressbook.Model.SoContactTitle,
            baseParams: {
                method: 'Addressbook.getSoContactTitles'
            },
            root: 'results',
            totalProperty: 'totalcount',
            id: 'id',
            remoteSort: false
        });
        if (Tine.Addressbook.registry.get('SoContactTitles')) {
        	costore.loadData(Tine.Addressbook.registry.get('SoContactTitles'));
        } 
        Ext.StoreMgr.add('AddressbookSopenExtContactTitleStore', costore);
    }
    
    return costore;
};

/**
 * 
 */
Tine.Addressbook.createLetterSalutation = function(_salcombo,_salrecord,_salindex){
	try{
		_salindex = Ext.getCmp('salutation_id').getValue()-1;
	}catch(e){
		return;
	}
 	
 	var lMap = ['Sehr geehrter Herr PREFIXNAME,', 'Sehr geehrte Frau PREFIXNAME,', 'Sehr geehrte Damen und Herren,', 'Sehr geehrte Frau NAME, \nSehr geehrter Herr NAME,'];
	var letterSal = lMap[_salindex];
	var title;
	var prefix;
	var formOfAddress = '';
	if(_salindex == 0){
		Ext.getCmp('contact_sex').setValue('MALE');
		formOfAddress = 'Herrn';
	}else if(_salindex == 1){
		formOfAddress = 'Frau';
		Ext.getCmp('contact_sex').setValue('FEMALE');
	}else{
		Ext.getCmp('contact_sex').setValue('NEUTRAL');
	}
 	switch(_salindex){
 	case 0:
	case 1:
	case 3:
		/*var withPartner = false;
		try{
			withPartner = Ext.getCmp('partner_lastname') & Ext.getCmp('partner_lastname').getValue();
		}catch(e){
			
		}
		if(withPartner){
			letterSal = 'Sehr CONTACTFORM PREFIXCONTACTNAMECONTACT,\nSehr PARTNERFORM PREFIXPARTNERNAMEPARTNER,';
			var partnerForm = '';
			var contactForm = '';
			var partnerSex;
			if(Ext.getCmp('partner_sex').getValue()=='MALE'){
				partnerSex = 'MALE';
				partnerForm = 'geehrter Herr';
			}else if(Ext.getCmp('partner_sex').getValue()=='FEMALE'){
				partnerForm = 'geehrte Frau';
				partnerSex = 'FEMALE';
			}else{
				letterSal = 'Sehr CONTACTFORM PREFIXCONTACTNAMECONTACT,\nSehr geehrte Damen und Herren,';
			}
			
			if(Ext.getCmp('contact_sex').getValue()=='MALE'){
				contactForm = 'geehrter Herr';
			}else if(Ext.getCmp('contact_sex').getValue()=='FEMALE'){
				contactForm = 'geehrte Frau';
			}else{
				if(Ext.getCmp('partner_sex').getValue()=='NEUTURAL'){
					letterSal = 'Sehr geehrte Damen und Herren,';
				}
			}
			
			letterSal = letterSal.replace('/CONTACTFORM/', contactForm);
			letterSal = letterSal.replace('/PARTNERFORM/', partnerForm);
			
			try{
				title1 = Tine.Addressbook.getSoContactTitleStore().getById(Ext.getCmp('n_prefix').getValue()).get('name');
			}catch(e){
				title1 = null;
			}
			try{
				prefix = (parseInt(Ext.getCmp('n_prefix').getValue(),10)>0)?title+" ":"";
			}catch(e){
				prefix = null;
			}
			letterSal = letterSal.replace(/PREFIXCONTACT/, prefix).replace(/NAMECONTACT/g, Ext.getCmp('last_name_id').getValue());
			
			try{
				title2 = Tine.Addressbook.getSoContactTitleStore().getById(Ext.getCmp('partner_title').getValue()).get('name');
			}catch(e){
				title2 = null;
			}
			try{
				prefix = (parseInt(Ext.getCmp('partner_title').getValue(),10)>0)?title+" ":"";
			}catch(e){
				prefix = null;
			}
			letterSal = letterSal.replace(/PREFIXPARTNER/, prefix).replace(/NAMEPARTNER/g, Ext.getCmp('partner_lastname').getValue());
		}else{*/
			try{
				title = Tine.Addressbook.getSoContactTitleStore().getById(Ext.getCmp('n_prefix').getValue()).get('name');
			}catch(e){
				title = null;
			}
			try{
				prefix = (parseInt(Ext.getCmp('n_prefix').getValue(),10)>0)?title+" ":"";
			}catch(e){
				prefix = null;
			}
			letterSal = letterSal.replace(/PREFIX/, prefix).replace(/NAME/g, Ext.getCmp('last_name_id').getValue());
		//}	
		break;
 	}
 	
 	var valueFormOfAddress = Ext.getCmp('form_of_address').getValue();
 	var fieldFormOfAddress = Ext.getCmp('form_of_address');
 	
 	/*if(formOfAddress){
 		formOfAddress += prefix +  Ext.getCmp('last_name_id').getValue();
 	}*/
 	if(!fieldFormOfAddress.disabled){
 		Ext.getCmp('form_of_address').setValue(formOfAddress);
 	}
 	var field = Ext.getCmp('letter_salutation');
 	
 	if(field && !field.disabled){
 		field.setValue(letterSal);
 	}
};

Tine.Addressbook.generateCurrencyLabel = function(_label){
	return _label + ' (€)';
};

/**
 * so contact titles
 */
Tine.Addressbook.Model.SoContactTitle = Ext.data.Record.create([
   {name: 'id'},
   {name: 'name'}
]);