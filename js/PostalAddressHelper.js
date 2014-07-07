
Tine.Addressbook.PostalAddressHelper = function(config){
	config = config || {};
    Ext.apply(this, config);

    Tine.Addressbook.PostalAddressHelper.superclass.constructor.call(this);
};

Ext.extend(Tine.Addressbook.PostalAddressHelper, Ext.util.Observable, {
	postalCode: null,
	location: null,
	countryCode: 'DE',
	postalCodeField: null,
	locationField: null,
	countryField: null,
	
	/**
	 *  state(valid|invalid) indicator
	 *  assume valid:true at the beginning
	 *  editing postal code or location inits invalid state until
	 *  server responded valid combination of postal code and location
	 **/
	valid:true,
	
	initialize: function(postalCodeFieldId, locationFieldId, countryFieldId){
		this.postalCodeField = Ext.getCmp(postalCodeFieldId);
		this.locationField = Ext.getCmp(locationFieldId);
		this.countryField = Ext.getCmp(countryFieldId);
		this.setPostalCode(this.postalCodeField.getValue());
		this.setLocation(this.locationField.getValue());
		
		this.postalCodeField.on('specialkey', this.onSubmitPostalCode, this);
		this.postalCodeField.on('blur', this.checkPostalCode, this);
		
		//this.locationField.on('specialkey', this.checkLocation, this);
		this.countryField.on('select', this.checkPostalCode, this);
		
		
		//this.locationField.store = 
		// 1. select default country
		// -> otherwise disable pC and loc
		// 2. 
		
		return this;
		
	},
	isValid: function(){
		return this.valid;
	},
	setValid: function(){
		this.valid = true;
	},
	setInvalid: function(){
		this.valid = false;
	},
	hasChangedPostalCode: function(){
		return this.postalCodeField.getValue() !== this.getPostalCode();
	},
	setPostalCode: function(postalCode){
		this.postalCode = postalCode;
	},
	getPostalCode: function(){
		return this.postalCode;
	},
	updatePostalCode: function(){
		this.setPostalCode(this.postalCodeField.getValue());
	},
	hasChangedCountryCode: function(){
		return this.countryField.getValue() !== this.getCountryCode();
	},
	isCountrySelected: function(){
		return this.countryField.getValue() !== null;
	},
	setCountryCode: function(countryCode){
		this.countryCode = countryCode;
	},
	getCountryCode: function(){
		return this.countryCode;
	},
	updateCountryCode: function(){
		this.setCountryCode(this.countryField.getValue());
	},
	hasChangedLocation: function(){
		return this.locationField.getValue() !== this.getLocation();
	},
	setLocation: function(location){
		this.location = location;
	},
	getLocation: function(){
		return this.location;
	},
	updateLocation: function(){
		this.setLocation(this.locationField.getValue());
	},
	
	getPostalCodeResponseObject: function(response){
		var result = Ext.util.JSON.decode(response.responseText);
		var obj = {
			isError: false,
			data: result.data,
			isSingle: result.data.length == 1
		};
		if(result.state!=='success'){
			obj.isError = true;
		}
		return obj;
	},
	
	presetLocationFieldFromPostalCode: function(response){
		var responseObj = this.getPostalCodeResponseObject(response);
		if(responseObj.isError){
			this.postalCodeField.focus();
			this.failurePostalCodeInvalid();
			this.postalCodeField.focus();
		}else{
			this.updatePostalCode();
			if(responseObj.isSingle){
				// clear location field store
				this.locationField.getStore().loadData([]);
				this.locationField.setValue(responseObj.data[0].place_name);
			}else{
				this.locationField.setValue('');
				this.locationField.emptyText = '...bitte wählen...';
				var data = [];
				for(var i=0; i<responseObj.data.length; i++){
					data[i] = responseObj.data[i].place_name;
				}
				this.locationField.getStore().loadData(data);
				this.locationField.focus();
				this.locationField.expand();
			}
		}
	},
	
	getLocationsByPostalCode: function(postalCode, countryCode, successFn, failureFn){
		Ext.Ajax.request({
            scope: this,
            success: successFn,
            params: {
                method: 'Addressbook.getLocationsByPostalCode',
                postalCode:  postalCode,
                countryCode: countryCode
            },
            failure: failureFn
        });
	},
	
	onSubmitPostalCode: function(field, e){
		 // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
        // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
        if (e.getKey() == e.RETURN || e.getKey() == e.TAB ) {
        	if(this.hasChangedPostalCode() || this.hasChangedCountryCode()){
        		this.checkPostalCode();
        	}
        }
	},
	
	checkPostalCode: function(){
   		if(this.isCountrySelected()){
   			this.updateCountryCode();
   		}
   		// check for valid postal code and preset location field
   		// 
   		if(this.postalCodeField.getValue()!=''){
	   		this.getLocationsByPostalCode(
	   			this.postalCodeField.getValue(),
	   			this.getCountryCode(),
	   			this.presetLocationFieldFromPostalCode, // -> success
	   			this.failurePostalCodeRequest			// -> failure
	   		);
   		}
 	},
	
	failurePostalCodeInvalid: function(){
		Ext.MessageBox.show({
			title: 'Fehler', 
            msg: 'Die eingegebene Postleitzahl existiert nicht.',
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.ERROR
        });
	},
	
	failurePostalCodeRequest: function(){
		Ext.MessageBox.show({
            title: 'Fehler', 
            msg: 'Bei der Abfrage der Postleitzahl ist ein Fehler aufgetreten.',
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.WARNING
        });
	},
	
	/**
	 * TODO implement reverse side (search postal codes for location)
	 * 
	 **/
	checkLocation: function(field, e){
//		 if (e.getKey() == e.ENTER || e.getKey() == e.TAB ) {
//			 if(this.hasChangedLocation()){
//	        	var location = this.locationField.getValue();
//	        	alert(location);
//			 }
//	     }
	}
});