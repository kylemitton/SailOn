Ext.define('DynaMightMobile.override.data.Store', {
    override: 'Ext.data.Store',
    autoLoad: false,
    wasInitialized: false,
    
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply(me.processEntityStore({}), cfg)]);
    },

    processEntityStore: function(config) {
        config.gridConfig = {
            object: 'BusinessEntity',
            gridClass : 'WorkforceGrid',
            method: 'GetEntityView',
            callback: function(a, b, c){
                
            }

        };
        //debugger;
        //config.model = 'DynaMightMobile.model.MyModel';
        config.storeId = 'MyModel';
        return config;
    },
    
    execConfig: function(config) {
        //debugger;
        var local = localStorage.goOffline;
        
        if (!this.wasInitialized) {
            this.applyDefaultConfig();
        }
        if (this.gridConfig) {
            config = Ext.applyIf(config || {}, this.gridConfig);
        }
        var cmd = {
            object : config.object || 'BusinessEntity',
            method: config.method || 'GetEntityView',
            params: config.params ? config.params : null,
            security: {
                //userID: APP.User ? APP.User.UId : 0
                //,                userToken: APP.User ? APP.User.Token : 0
            }
        };
        if(!local)
        {
        var cmdText = Ext.JSON.encode(cmd);
        this._proxy._extraParams = {command: cmdText};
        }
        if (config.callback)
        {
            //alert('');
            //this.on('load', config.callback, config.scope);
        }
        
        this.load(config.callback ? {callback: config.callback, scope: config.scope} : {});
        

    }, 
    applyDefaultConfig: function(){
        var me = this;
        
        var local = localStorage.goOffline,
            proxyType= local? 'Sql' : 'Ajax';
        
        this.setProxy( Ext.create('Ext.data.proxy.' + proxyType,{
               //database: 'Sail',

                actionMethods: {
                    create: 'POST',
                    destroy: 'POST',
                    read: 'POST',
                    update: 'POST'
                },
                url: AJAX_URL + AJAX_HANDLER,
                reader: {
                    type: 'json',
                    //root: 'records',
                    rootProperty: 'records'//me.storeRoot
                },
                batchActions: false
            })
        );
        this.wasInitialized = true;
    },
    getAllRecords: function(config)
    {
        var returnArray = [];
        //this.clearFilter();
        /*this.each(function(record) 
        {
            returnArray.push(record.data);
        });*/
        var recs = this.getNewRecords();
        for (var i = 0; i < recs.length; i++) 
        {
            var record = recs[i];
            returnArray.push(record.data);
        }
        recs = this.getRemovedRecords();
        for (var i = 0; i < recs.length; i++) 
        {
            var record = recs[i];
            returnArray.push(record.data);
        }
        return returnArray;
    },
    
    getFilteredRecords: function(config)
    {
        var returnArray = [];
        //this.clearFilter();
        /*this.each(function(record) 
        {
            returnArray.push(record.data);
        });*/
        var recs = this.getData().items;
        for (var i = 0; i < recs.length; i++) 
        {
            var record = recs[i];
            returnArray.push(record.data);
        }
        return returnArray;
    }
});
