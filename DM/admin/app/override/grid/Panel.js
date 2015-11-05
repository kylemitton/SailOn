Ext.define('DynaMight.override.grid.Panel', {
    override: 'Ext.grid.Panel',
    hiddenFields:[false, false, false, false, true],//add, edit, delete, search, customfields
    initComponent: function()
    {
        this.beforeInit();
        this.callParent(arguments);
        this.afterInit();
    },
    
    beforeInit: function(){
        var me = this;
        this.dockedItems = [this.topToolbar = {
            xtype: 'toolbar',
            itemId: 'topTb',
            items: [
                Ext.create('Ext.Action', {
                    iconCls   : 'addGridIcon',  // Use a URL in the icon config
                    text: 'Add',
                    handler: me.onAddGrid,
                    hidden: me.hiddenFields[0],
                    scope: me
                }),
                Ext.create('Ext.Action', {
                    iconCls   : 'editGridIcon',  // Use a URL in the icon config
                    text: 'Edit',
                    handler: me.onEditGrid,
                    hidden: me.hiddenFields[1],
                    scope: me
                }),
                Ext.create('Ext.Action', {
                    iconCls   : 'deleteGridIcon',  
                    text: 'Delete',
                    handler: me.onDeleteGrid,
                    hidden: me.hiddenFields[2],
                    scope: me
                }),
                '->',
                me.searchCmb = Ext.create('Ext.form.field.ComboBox',{
                    typeAhead: true,
                    triggerAction: 'all',
                    value:'All',
                    hidden: true,
                    store: GETDATA(me.customConfig.searchingFields),
                    //[                        ['All','All']                    ],
                    hidden: true// me.hiddenFields[3]
                }),
                Ext.create('Ext.form.field.Text', {
                    emptyText: 'Search',
                    width: 150,
                    listeners: {
                        buffer: 50,
                        delay: 2000,
                        change: me.onSearch,
                        scope: me
                    },
                    hidden: me.hiddenFields[3]
                }),
                Ext.create('Ext.Action', {
                    iconCls   : 'customGridIcon',  
                    text: 'Custom fields',
                    handler: me.onCustomGrid,
                    scope: me,
                    hidden: me.hiddenFields[4]
                }),
                Ext.create('Ext.Action', {
                    iconCls   : 'viewModeIcon',  
                    //text: 'Switch view',
                    handler: me.onViewMode,
                    scope: me,
                    hidden: me.hiddenFields[5] || false
                }),
                
                Ext.create('Ext.Action', {
                    iconCls   : 'gridModeIcon',  
                    //text: 'Switch view',
                    handler: me.onGridMode,
                    scope: me,
                    hidden: me.hiddenFields[6] || false
                })
            ]
        }];
    },
    
    afterInit: function(){
        var me = this;
        this.getStore().execConfig({
            params: {entityViewID: me.entityConfig.entityviewid}
        }); 
    },
    
    onDeleteGrid: function(widget, event) {
        //debugger;
        var me = this,
            store = this.getStore(),
            rec;
        
        if(me.viewPanel)
            rec = me.viewPanel.items.items[0].getSelectionModel().getSelection()[0];
        else
            rec = me.getSelectionModel().getSelection()[0];
        
        if (rec) {
            store.execConfig({
                method: store.gridConfig.deleteMethod || 'Delete',
                params: {
                    EntityName: me.entityConfig.entityname,
                    ID: rec.get(me.entityConfig.entityname + "id")
                        || rec.get(me.entityConfig.entityname.replace("sys", "") + "id"),
                    RefreshEntityViewID: me.entityConfig.entityviewid
                }
            });
        }
    },
    
    onAddGrid: function(){
        var me = this;
        var store = this.getStore();
        var addForm = Ext.create('DynaMight.view.AddEdit', {
            entityConfig: me.entityConfig,
            entityStore: me.getStore()
        });
        var window = Ext.create('Ext.window.Window', {
            title: 'Add '+  store.gridConfig.entity,
            layout: 'vbox',
            modal: true,
            items: [
                addForm
            ]
        });
        addForm.parentWindow = window;
        window.show();
    },
    
    onEditGrid: function(a, b, c){
        var rec;
        if(this.viewPanel)
            rec = this.viewPanel.items.items[0].getSelectionModel().getSelection()[0];
        else
            rec = this.getSelectionModel().getSelection()[0];
        
        if (!rec) {
            return;
        }
        var me = this;
        var editForm = Ext.create('DynaMight.view.AddEdit', {
            entityConfig: me.entityConfig,
            entityStore: me.getStore(),
            entityRecord: rec
            
        });
        //debugger;
        editForm.form.setValues(rec.raw);
        var window = Ext.create('Ext.window.Window', {
            title: 'Edit' ,
            layout: 'vbox',
            modal: true,
            items: [
                editForm
            ]
        });
        editForm.parentWindow = window;
        window.show();
    },
    onSearch: function(txt, val, oldVal){
        var me = this;
        var store = this.getStore();
        //debugger;
        store.execConfig({
            method: this.customConfig.getMethod,
            params: {filter: val, 
                     field : me.searchCmb.getValue(),
                     entityViewID: me.entityConfig.entityviewid}
        });

    },
    onCustomGrid: function(){
        var me = this;
        var addForm = Ext.create('customfieldgrid',{entity: me.getStore().gridConfig.entity});
        OpenWindow({
            title: 'Manage custom fields' ,
            childView: addForm
            
        });
        
    },
    onViewMode: function(btn){
        var me = this;
        var store = this.getStore();
        var viewCmp = new Ext.create('Ext.panel.Panel', {
            
            title: 'View mode',
            tbar : this.topToolbar,
            items:[
                {
                    xtype:'dataview',
                    singleSelect: true,
                    store: store,
                    overItemCls: 'x-view-over',
                    itemSelector: 'div.thumb-wrap',
                    //width: 500,
                    height: 500,
                    tpl: [
                        me.customConfig.template || WORKFORCE_TEMPLATE
                    
                    ]
                }
            ]
        });
        this.viewPanel = viewCmp;
        DynaMight.app.getController('Security').setVisiblePanel(viewCmp);
        
    },
    onGridMode: function(btn){
        var store = this.getStore();
        var panel = Ext.create('TimeMan.view.' + store.gridConfig.gridClass,{});
        this.viewPanel = null;
        DynaMight.app.getController('Security').setVisiblePanel(panel);
    }
});



