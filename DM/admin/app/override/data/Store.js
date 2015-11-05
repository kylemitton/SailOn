Ext.define('DynaMight.override.data.Store', {
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
                var a = 1;
            }

        };
        config.model = 'DynaMight.model.DefaultModel';
        config.storeId = 'DefaultModel';
        return config;
    },
    
    execConfig: function(config) {
        //debugger;
        if (!this.wasInitialized) {
            this.applyDefaultConfig();
        }
        if (this.gridConfig) {
            config = Ext.applyIf(config || {}, this.gridConfig);
        }
        var cmd = {
            object : config.object || 'Business',
            method: config.method,
            params: config.params ? config.params : null,
            security: {
                userID: APP.User ? APP.User.UId : 0
                //,                userToken: APP.User ? APP.User.Token : 0
            }
        };

        var cmdText = Ext.JSON.encode(cmd);
        this.proxy.extraParams = {command: cmdText};
        if (config.callback)
        {
            this.on('load', config.callback, config.scope);
        }
        
        this.load();
        

    }, 
    applyDefaultConfig: function(){
        var me = this;
        this.setProxy( Ext.create('Ext.data.proxy.Ajax',
            {
                actionMethods: {
                    create: 'POST',
                    destroy: 'POST',
                    read: 'POST',
                    update: 'POST'
                },
                url: AJAX_URL + AJAX_HANDLER,
                reader: {
                    type: 'json',
                    root: 'records',
                    rootProperty: 'data'//me.storeRoot
                },
                batchActions: false
            })
        );
        this.wasInitialized = true;
    },
    listeners: {
        add: function(store, records, index)
        {
            for (var i = 0; i < records.length; i++) 
            {
                //if(records[i].data.sysrowstate === '') 
                records[i].data.sysrowstate = '0'; 
                
            }
        },
        update: function(store, record, type)
        {
            if(record.data.sysrowstate == '2') 
            {   
                return;
            }
            else if(record.data.sysrowstate == '0') 
            {   
                return;
            }
            else if(record.phantom === true)
            { 
                record.data.sysrowstate = '0'; 
            }
            else
            {
                record.data.sysrowstate = '1';
            }
        },
        remove: function(store, record, index)
        {
            if(record.phantom === true) 
                record.data.sysrowstate = ''; 
            else
                record.data.sysrowstate = '2'; 
        }
    },
    getAllRecords: function(config)
    {
        var returnArray = [];
        this.clearFilter();
        this.each(function(record) 
        {
            returnArray.push(record.data);
        });
        for (var i = 0; i < this.removed.length; i++) 
        {
            var record = this.removed[i];
            returnArray.push(record.data);
        }
        return returnArray;
    }
    
});