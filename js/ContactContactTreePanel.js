Ext.ns('Tine.Addressbook');

Ext.ns('Tine.Addressbook.Contact');
Tine.Addressbook.Contact.NODE_TYPE_DEGREE_GROUP = 'degree_group';
Tine.Addressbook.Contact.NODE_TYPE_RELATION_DESCRIPTOR = 'relation_descriptor';
Tine.Addressbook.Contact.NODE_TYPE_CONTACT = 'contact';

Tine.Addressbook.Contact.RELATION_DEGREE_PARENT = 'parent';
Tine.Addressbook.Contact.RELATION_DEGREE_SIBLING = 'sibling';
Tine.Addressbook.Contact.RELATION_DEGREE_CHILD = 'child';

Tine.Addressbook.Contact.RELATION_FOLLOWUP_DIR_UP = 'up';
Tine.Addressbook.Contact.RELATION_FOLLOWUP_DIR_DOWN = 'down';
Tine.Addressbook.Contact.RELATION_FOLLOWUP_DIR_BOTH = 'both';


Tine.Addressbook.ContactContactTreeLoader = function(config){
	config = config || {};
    Ext.apply(this, config);
    Tine.Addressbook.ContactContactTreeLoader.superclass.constructor.call(this);
};

Ext.extend(Tine.Addressbook.ContactContactTreeLoader ,Ext.tree.TreeLoader, {
	nodeId: 1,
	contactRecord: null,
	followUp: true,
	followUpDirection: Tine.Addressbook.Contact.RELATION_FOLLOWUP_DIR_BOTH,
	createRoot: function(){
		var children = [];
		switch(this.followUpDirection){
			case Tine.Addressbook.Contact.RELATION_FOLLOWUP_DIR_UP:
				children = [this.getRelationDegreeGroupParentsNode(this.contactRecord.get('id'))];
				break;
			case Tine.Addressbook.Contact.RELATION_FOLLOWUP_DIR_DOWN:
				children = [ this.getRelationDegreeGroupChildrenNode(this.contactRecord.get('id'))];
				break;
			case Tine.Addressbook.Contact.RELATION_FOLLOWUP_DIR_BOTH:
				children = [ this.getRelationDegreeGroupParentsNode(this.contactRecord.get('id')),
				             this.getRelationDegreeGroupChildrenNode(this.contactRecord.get('id'))];
				break;
		}
		return new Ext.tree.AsyncTreeNode({
			text: this.contactRecord.get('n_fileas'),
			leaf: false,
			expanded: false,
			children: children
		});
	},
	getRelationDegreeGroupParentsNode: function(contactId){
		var node = this.getCategoryNode(this.nodeId++,'',{
	 	   params: {
	 		   contactId: contactId, 
		 	   nodeType: Tine.Addressbook.Contact.NODE_TYPE_DEGREE_GROUP,
		 	   isFolder: true,
		 	   direction: Tine.Addressbook.Contact.RELATION_DEGREE_PARENT
	 	   }
	    });
		node.iconCls = 'contactContactTreeIconUp';
		return node;
	},
	getRelationDegreeGroupChildrenNode: function(contactId){
		var node = this.getCategoryNode(this.nodeId++,'',{
		 	   params: {
	 		   contactId: contactId, 
	 		   nodeType: Tine.Addressbook.Contact.NODE_TYPE_DEGREE_GROUP,
		 	   isFolder: true,
		 	   direction: Tine.Addressbook.Contact.RELATION_DEGREE_CHILD
	 	   }
	    });
		node.iconCls = 'contactContactTreeIconDown';
		return node;
	},
	getCategoryNode: function(id, text, config){
		return new Ext.tree.AsyncTreeNode({
					id: id,
					text: text,
					leaf: !config.params.isFolder,
					expanded: false,
					config: config
			});
	},
    addNode: function(attrs, nodeType, direction) {
		switch(nodeType){
		case Tine.Addressbook.Contact.NODE_TYPE_RELATION_DESCRIPTOR:
			return this.createRelationNode(attrs, direction);
			break;
		case Tine.Addressbook.Contact.NODE_TYPE_CONTACT:
			return this.createContactNode(attrs);
		}
	},
	createRelationNode: function(attrs, direction){
		var node = new Ext.tree.AsyncTreeNode({
			id: this.nodeId++,
			text: Ext.util.Format.htmlEncode(attrs.name),
			qtip: Ext.util.Format.htmlEncode(attrs.description),
			leaf: false,
			expanded: false,
			config: {
				params: {
					relationDescriptorId: attrs.id,
					fromContactId: attrs.from_contact_id,
					toContactId: attrs.to_contact_id,
					nodeType: Tine.Addressbook.Contact.NODE_TYPE_RELATION_DESCRIPTOR,
					isFolder: true,
					direction: direction
				}
			}
		});
		node.iconCls = 'contactContactTreeIconRelation';
		return node;
	},
	createContactNode: function(attrs){
		var children = [];
		switch(this.followUpDirection){
			case Tine.Addressbook.Contact.RELATION_FOLLOWUP_DIR_UP:
				children = [this.getRelationDegreeGroupParentsNode(this.contactRecord.get('id'))];
				break;
			case Tine.Addressbook.Contact.RELATION_FOLLOWUP_DIR_DOWN:
				children = [ this.getRelationDegreeGroupChildrenNode(this.contactRecord.get('id'))];
				break;
			case Tine.Addressbook.Contact.RELATION_FOLLOWUP_DIR_BOTH:
				children = [ this.getRelationDegreeGroupParentsNode(this.contactRecord.get('id')),
				             this.getRelationDegreeGroupChildrenNode(this.contactRecord.get('id'))];
				break;
		}
		var node = new Ext.tree.AsyncTreeNode({
			id: this.nodeId++,
			text: Ext.util.Format.htmlEncode(attrs.n_fileas),
			//qtip: Ext.util.Format.htmlEncode(attrs.description),
			leaf: false,
			expanded: false,
			children: children
		});
		node.iconCls = 'contactContactTreeIconContact';
		return node;		
	},
    processResponse: function(response, node, callback, scope) {
	    // convert tine search response into usual treeLoader structure
	    var o = response.responseData || Ext.decode(response.responseText);
	    if (o.totalcount) {
	        // take results part as response only
	        response.responseData = o.results;
	        node.beginUpdate();
	        nodeType = o.nodeType;
	        var atts;
	        var n;
	        for(var i = 0, len = o.results.length; i < len; i++){
	        	if(typeof(o.results[i])!='object'){
	        		continue;
	        	}
	    		
	    		try{
	    			atts = node.attributes.attributes.config.params;
	    		}catch(e){
	    			try{
	    				atts = node.attributes.config.params;
	    			}catch(e){
	    				atts = node.config.params;
	    			}
	    		}
	        	n = this.addNode(o.results[i], nodeType, atts.direction);
	        	if(n){                    
	        		 node.appendChild(n);                
	        	}            
	        }            
	        node.endUpdate();
	        this.runCallback(callback, scope || node, [node]);
	    }
	},
    
    inspectCreateNode: function(attr) {
        Ext.apply(attr, {
            text: Ext.util.Format.htmlEncode('name'),
            qtip: Ext.util.Format.htmlEncode('description'),
           // selected: attr.id === this.selectedFilterId,
            id: this.nodeId++,
            leaf: false
        });
    }	
});

Tine.Addressbook.ContactContactTreePanel = function(config){
	config = config || {};
    Ext.apply(this, config);
    Tine.Addressbook.ContactContactTreePanel.superclass.constructor.call(this);
};

Ext.extend( Tine.Addressbook.ContactContactTreePanel, Ext.tree.TreePanel, {
    autoScroll: true,
    border: false,
    rootVisible: true,
    useArrows:true,
    width:500,
    height:400,
    contactRecord: null,
    listeners: {
        click: function(node, event){
           // //console.log(node);
        }
    },

    initComponent: function(){
	    this.loader = new Tine.Addressbook.ContactContactTreeLoader({
	    	contactRecord: this.contactRecord,
	    	url: 'index.php',
	    	getParams: this.onBeforeLoad.createDelegate(this)
	    });
		this.root = this.loader.createRoot();
	    Tine.Addressbook.ContactContactTreePanel.superclass.initComponent.call(this);
	},
    onBeforeLoad: function(node) {
		////console.log(node);
		var atts;
		try{
			atts = node.attributes.attributes.config.params;
		}catch(e){
			try{
				atts = node.attributes.config.params;
			}catch(e){
				atts = node.config.params;
			}
		}

	    var params = {
            method: 'Addressbook.getContactContactTreeNodes',
            treeNodeId: node.id,
            params:  atts
        };
        return params;
    }
});
