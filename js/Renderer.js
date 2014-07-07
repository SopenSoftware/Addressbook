Ext.ns('Tine.Addressbook.renderer');

Tine.Addressbook.renderer.mainCategory =  function(value) {
	if(!value){
		return null;
	}
	try{
		var store = Sopen.GenericAttribute.getStore('main_category_contact_id');
		var stateEntity = store.getAt(store.indexOfId(value));
		return stateEntity.get('name');
	}catch(e){
		return "";
	}
};


Tine.Addressbook.renderer.sexShort =  function(value) {
	if(!value){
		return null;
	}
	switch(value){
	case 'MALE':
		return 'm';
	case 'FEMALE':
		return 'w';
	case 'NEUTRAL':
	default:
		return 'n';
	}

    if(!value){
        return null;
    }
    try {
        var store = Sopen.GenericAttribute.getStore('main_category_contact_id');
        var stateEntity = store.getAt(store.indexOfId(value));
        return stateEntity.get('name');
    } catch(e){
        return '';
    }
};

Tine.Addressbook.renderer.salutation = function(value) {
    if(!value){
        return null;
    }
    try {
        return Tine.Addressbook.getSalutationStore().getById(value).get('name');
    } catch(e) {
        return '';
    }
}

Tine.Addressbook.renderer.title = function(value) {
    if(!value){
        return null;
    }
    try {
        return Tine.Addressbook.getSoContactTitleStore().getById(value).get('name');
    } catch(e) {
        return '';
    }
}
