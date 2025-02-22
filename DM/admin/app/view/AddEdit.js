/*
 * File: app/view/AddEdit.js
 *
 * This file was generated by Sencha Architect version 3.0.4.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('DynaMight.view.AddEdit', {
    extend: 'Ext.form.Panel',

    alternateClassName: [
        'addedit'
    ],
    requires: [
        'Ext.form.FieldSet',
        'Ext.button.Button'
    ],

    itemId: 'addEdit',
    maxHeight: 700,
    width: 693,
    bodyPadding: 10,
    header: false,
    title: 'Add Workforce',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'right',
                labelWidth: 115,
                msgTarget: 'side',
                width: 350,
                margin: '5 0 0 0'
            },
            items: [
                me.processCustomFieldsFS({
                    xtype: 'fieldset',
                    itemId: 'customFieldsFS',
                    maxHeight: 650,
                    maxWidth: 900,
                    title: 'Info',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    }
                })
            ],
            dockedItems: [
                {
                    xtype: 'container',
                    dock: 'bottom',
                    height: 32,
                    itemId: 'buttonsCt',
                    width: 812,
                    layout: {
                        type: 'hbox',
                        pack: 'end'
                    },
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'saveBtn',
                            width: 97,
                            text: 'Save',
                            listeners: {
                                click: {
                                    fn: me.onSaveBtnClick,
                                    scope: me
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            itemId: 'entityCancelBtn',
                            margin: '0 10 0 10',
                            width: 101,
                            text: 'Cancel',
                            listeners: {
                                click: {
                                    fn: me.onCancelBtnClick,
                                    scope: me
                                }
                            }
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    },

    processCustomFieldsFS: function(config) {
        //var fields = this.entityConfig.Fields.split(',');
        var me = this;
        var fields = APP.Fields;
        var entityFields = '';
        config.items = [];

        var handler = function(store, entityView){
            var addForm = Ext.create('DynaMight.view.AddEdit', {
                entityConfig: entityView,//me.entityConfig,
                entityStore: store
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
            //store.load();
        };

        //debugger;
        for (var i = 0; i < APP.Properties.length; i++) {
            var rec = APP.Properties[i],
                entityView;

            if(rec.childentityid == this.entityConfig.entityid)
            {
                entityFields += (entityFields ? ',' : '') + rec.childname;

                entityView = GetEntityView(rec.parententityid);

                var store = new Ext.data.Store({model: rec.entityname});
                store.execConfig({
                    params: {entityViewID: entityView.entityviewid,
                             filter:''}
                });
                //debugger;
                config.items.push({
                    xtype: 'container',
                    layout: 'hbox',
                    items:[{

                        xtype: 'combobox',
                        itemId: 'cmb' + rec.childname,
                        fieldLabel: rec.description || rec.childname,
                        name: rec.childname,
                        //allowBlank: false,
                        //allowOnlyWhitespace: false,
                        displayField: GetDisplayField(store.model.prototype.fields.items),//store.displayField,//store.model.prototype.fields.items[1].name,
                        store: store,
                        valueField: rec.parentname,
                        tpl1: Ext.create('Ext.XTemplate',
                            '<tpl for="."><div class="x-boundlist-item" >',
                                (entityView.pickertemplate ||
                                 '{' + GetDisplayField(store.model.prototype.fields.items) + '}'),
                            '</div></tpl>'
                        ),
                        tpl: Ext.create('Ext.XTemplate',
                            '<tpl for="."><div class="x-boundlist-item" >',
                                        rec.name === 'FK_FileResource_Resource'? '<img width="16" height="16" src="../common/images/uploaded/{path}" align="left">&nbsp;&nbsp;' : '',
                                (entityView.pickertemplate ||
                                 '{' + GetDisplayField(store.model.prototype.fields.items) + '}'),
                            '</div></tpl>'
                        ),
                        entityView: entityView
                    },
                    Ext.create('Ext.button.Button',{
                        //xtype: 'button',
                        text: '+',
                        margin: '5',
                        parentId: 'cmb' + rec.childname,
                        handler:  function(){
                            var pCmb = me.down('#' + this.parentId);
                            var addForm = Ext.create('DynaMight.view.AddEdit', {
                                entityConfig: pCmb.entityView//me.entityConfig,
                                //entityStore: pCmb.store
                            });
                            var window = Ext.create('Ext.window.Window', {
                                //title: 'Add '+  store.gridConfig.entity,
                                layout: 'vbox',
                                modal: true,
                                items: [
                                    addForm
                                ],
                                listeners: {
                                    close: function(){
                                        pCmb.store.reload();
                                    }
                                }
                            });
                            addForm.parentWindow = window;
                            window.show();
                            //store.load();
                        }
                    })]
                });
            }

        }
        for (var i = 0; i < fields.length; i++) {

            var rec = fields[i];

            if(rec.entityid != this.entityConfig.entityid || rec.iseditable == '0') continue;
        //debugger;

            entityFields += (entityFields ? ',' : '') + rec.name;
            var obj = {
                xtype:rec.xtype,
                itemId: rec.propertyid,
                name: rec.name,
                fieldLabel: rec.description || rec.name,
                fieldWidth: 60,
                format: 'Y-m-d',
                //allowBlank: false,//(rec.xtype == 'filefield') || false
                buttonOnly: true
            };

            if(rec.xtype == 'filefield'){
                config.items.push({
                    xtype: 'hidden',
                    name: obj.name,
                    itemId: obj.name
                });
                obj.name += 'id';

            }

            if(rec.xtype == 'combo'){
                obj.getValue = function(){
                    return this.value && this.multiSelect ? this.value.join(',') : this.value;
                };
                obj.setValue1 = function(val){
                    if(val && typeof val == 'string' && this.multiSelect)
                        val = val.split(',');
                    //this.setRawValue(val);
                    this.callParent(val);
                    return this;
                };
                obj.editable = false;
            }
        //debugger;
            if(rec.config){
                Ext.apply(obj, eval('('+rec.config+')'));
            }

            config.items.push(obj);
        }


        config.items.push({
            xtype:'hidden',
            itemId: 'entityFieldsId',
            name: 'EntityFields',
            value: entityFields
        });
        return config;
    },

    onSaveBtnClick: function(button, e, eOpts) {
        //debugger;
        var rec, store,
            edit = this,
            form = edit.getForm();

        //validate
        if (!form.isValid()) {
            Ext.Msg.show({
                title: 'Invalid form!',//T('errLogIn'),
                msg: 'Form is invalid. Fill in all required fields.',//T(''),
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR,
                modal: true
            });
            return;
        }

        //exec
        rec = form.getValues();
        rec.entityname = edit.entityConfig.entityname;
        rec.RefreshEntityViewID = edit.entityConfig.entityviewid;
        //rec.EntityFields = this.getAddEdit().entityConfig.Fields;

        store = edit.entityStore ||
            new Ext.data.Store({model: rec.entityname});

        store.execConfig({
            method: 'EditEntity',
            params: rec,
            callback: function(){
                edit.parentWindow.close();
            }
        });


        //close

    },

    onCancelBtnClick: function(button, e, eOpts) {
        this.parentWindow.close();
    }

});