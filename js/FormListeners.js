Ext.namespace('Tine.Addressbook');
Ext.namespace('Tine.Addressbook.Listeners');

// tab contacts

Tine.Addressbook.Listeners.birthdayFieldChangeListener = function(field, value){
	// use sodiac sign calculator
	var sodiac = new org.sopen.client.gui.dialog.form.calculators.sodiacSign(value);
	Ext.getCmp('sodiac_sign').setValue(sodiac.getSodiacSign());
	sodiac = null;
	// use age calculator
	Ext.getCmp('age').setValue(org.sopen.client.gui.dialog.form.calculators.calcAge(value));
};

Tine.Addressbook.Listeners.mainCategoryMirrorChangeListener = function(field, value){
	try{
		switch(field.id){
			case 'main_category_contact_id_mirror':
				Ext.getCmp('main_category_contact_id').setValue(value);
				break;
			case 'main_category_contact_id':
				Ext.getCmp('main_category_contact_id_mirror').setValue(value);
				break;
		}
	}catch(e){
	}
};

/**
 * change listener: debitor_ext_id
 * triggers unique check on server
 */
Tine.Addressbook.Listeners.debitorNumberChangeListener = function(field, value){
	if((field.getValue() == null) || (field.getValue() == '') || (field.getValue()<=0)){
		Ext.Msg.alert(
			'Fehler', 
            'Bitte geben Sie zuerst einen Wert für die Debitor-Nr ein.'
        );
		return;
	}
	try{
		var contactId = Ext.getCmp('contact_id').getValue();
		Ext.Ajax.request({
            scope: this,
            params: {
                method: 'Addressbook.debitorCheckUnique',
                debitorExtId:  field.getValue(),
                contactId: contactId
            },
            success: function(response){
            	var result = Ext.util.JSON.decode(response.responseText);
            	if(!result.success){
            		var adressNr = result.data.contact_id;
            		var debitorExtId = result.data.debitor_ext_id;
            		var name = result.data.n_fileas;
            		var org_name = result.data.org_name;
            		var company2 = result.data.company2;
    				Ext.Msg.alert(
						'Hinweis', 
			            'Die von Ihnen eingegebene Debitor-Nr: ' + debitorExtId + 
			            ' existiert bereits im Zusammenhang mit <br />Adressnummer: ' + adressNr +
			            '<br />Name: ' + name +
			            '<br />Firma: ' + org_name + ', ' + company2
			        );
            	}

        	},
        	failure: function(response){
        		Ext.Msg.alert(
					'Fehler', 
		            'Die Plausibilitätsprüfung konnte nicht durchgeführt werden.'
		        );
        	}
        });
	}catch(e){
		alert(e.message);
	}
};

/**
 * validate listener: debitor_ext_id
 * on successfull form validation trigger the unique check, if the field is filled
 */
Tine.Addressbook.Listeners.debitorNumberValidateListener = function(field, value){
	if((field.getValue() == null) || (field.getValue() == '') || (field.getValue()<=0)){
		return true;
	}
	Tine.Addressbook.Listeners.debitorNumberChangeListener(field,value);
	return true;
};

// tab member

// etc.
