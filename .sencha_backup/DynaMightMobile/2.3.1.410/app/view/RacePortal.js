/*
 * File: app/view/RacePortal.js
 *
 * This file was generated by Sencha Architect version 3.2.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.3.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.3.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('DynaMightMobile.view.RacePortal', {
    extend: 'Ext.form.Panel',

    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.dataview.List',
        'Ext.XTemplate',
        'Ext.field.Select',
        'Ext.Button',
        'Ext.Label'
    ],

    config: {
        itemId: 'racePortal',
        layout: {
            type: 'card',
            animation: 'slide'
        },
        items: [
            {
                xtype: 'formpanel',
                itemId: 'todayRaces',
                layout: 'vbox',
                scrollable: true,
                items: [
                    {
                        xtype: 'fieldset',
                        margin: 5,
                        title: 'Race Sign On- Select Boat'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'container',
                                flex: 1,
                                layout: 'vbox',
                                items: [
                                    {
                                        xtype: 'fieldset',
                                        margin: 5,
                                        title: 'Today\'s Races',
                                        items: [
                                            {
                                                xtype: 'list',
                                                height: 150,
                                                itemId: 'racesSignOnList',
                                                itemTpl: [
                                                    '<div>{name}</div>'
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'fieldset',
                                        margin: 5,
                                        title: 'Messages and Notices',
                                        items: [
                                            {
                                                xtype: 'list',
                                                height: 150,
                                                itemId: 'messagesList',
                                                itemTpl: [
                                                    '<div>{name} - {message}</div>'
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldset',
                                width: 204,
                                title: 'Weather',
                                items: [
                                    {
                                        xtype: 'component',
                                        itemId: 'weatherCmp'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        margin: 5,
                        items: [
                            {
                                xtype: 'selectfield',
                                hidden: false,
                                itemId: 'boatNumberCmb',
                                label: 'Boat\'s Sail / Hull Number',
                                name: 'boatid',
                                displayField: 'bname',
                                valueField: 'boatid'
                            },
                            {
                                xtype: 'textfield',
                                itemId: 'skipperNumber',
                                label: 'Skipper\' s YA Number'
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        docked: 'bottom',
                        height: 40,
                        itemId: 'bottomCt',
                        margin: 20,
                        width: 969,
                        items: [
                            {
                                xtype: 'button',
                                docked: 'right',
                                itemId: 'nextSignOnBtn',
                                text: 'Next >>'
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'formpanel',
                itemId: 'signOnCard',
                layout: 'vbox',
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Race Sign On - Review',
                        items: [
                            {
                                xtype: 'label',
                                itemId: 'seriesReview'
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        itemId: 'raceBoatBt',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'fieldset',
                                itemId: 'loginCt',
                                margin: 0,
                                title: 'Boat Info',
                                layout: {
                                    type: 'vbox',
                                    align: 'start'
                                },
                                items: [
                                    {
                                        xtype: 'container',
                                        docked: 'bottom',
                                        height: 40,
                                        itemId: 'bottomCt',
                                        margin: 20,
                                        items: [
                                            {
                                                xtype: 'button',
                                                centered: true,
                                                docked: 'right',
                                                itemId: 'editPortalBtn',
                                                text: 'Edit'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'fieldset',
                                        itemId: 'generalInfoFS',
                                        items: [
                                            {
                                                xtype: 'textfield',
                                                label: 'Sail/Hull Number',
                                                name: 'hullnumber'
                                            },
                                            {
                                                xtype: 'textfield',
                                                label: 'Boat Name',
                                                name: 'name'
                                            },
                                            {
                                                xtype: 'textfield',
                                                label: 'Skipper\'s YA Number',
                                                name: 'ya'
                                            },
                                            {
                                                xtype: 'textfield',
                                                label: 'Skypper\'s Details',
                                                name: 'skippername'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldset',
                                flex: 1,
                                title: 'Race Info',
                                layout: {
                                    type: 'hbox',
                                    align: 'start'
                                },
                                items: [
                                    {
                                        xtype: 'list',
                                        flex: 1,
                                        height: 200,
                                        itemId: 'portalRacesList',
                                        itemTpl: [
                                            '<div>Race {name}</div>'
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        docked: 'bottom',
                                        itemId: 'btnsCt',
                                        layout: 'hbox',
                                        items: [
                                            {
                                                xtype: 'button',
                                                itemId: 'signOnBtn',
                                                text: 'Sign On'
                                            },
                                            {
                                                xtype: 'button',
                                                itemId: 'signOffBtn',
                                                text: 'Sign Off'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        itemId: 'messWatherCt',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'fieldset',
                                hidden: false,
                                width: 200,
                                title: 'Weather'
                            },
                            {
                                xtype: 'fieldset',
                                flex: 1,
                                title: 'Race Messages and Notices',
                                items: [
                                    {
                                        xtype: 'list',
                                        height: 150,
                                        itemId: 'raceBoatsList',
                                        itemTpl: [
                                            '<div>{message}</div>'
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'formpanel',
                itemId: 'reviewCard',
                layout: 'vbox',
                scrollable: true,
                items: [
                    {
                        xtype: 'fieldset',
                        margin: 5,
                        title: 'You are Signed On'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'container',
                                flex: 1,
                                layout: 'vbox',
                                items: [
                                    {
                                        xtype: 'fieldset',
                                        margin: 5,
                                        title: 'Today Race Info'
                                    },
                                    {
                                        xtype: 'fieldset',
                                        margin: 5,
                                        title: 'Boat Info',
                                        items: [
                                            {
                                                xtype: 'list',
                                                height: 150,
                                                itemId: 'entrantsList',
                                                itemTpl: [
                                                    '<div>{bname}</div>'
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldset',
                                width: 204,
                                title: 'Weather'
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        docked: 'bottom',
                        height: 40,
                        itemId: 'bottomCt',
                        margin: 20,
                        width: 969,
                        items: [
                            {
                                xtype: 'button',
                                docked: 'right',
                                itemId: 'opsBtn',
                                text: 'Opps !. Undo'
                            },
                            {
                                xtype: 'button',
                                docked: 'left',
                                itemId: 'doneBtn',
                                text: 'Done'
                            }
                        ]
                    }
                ]
            }
        ]
    },

    initialize: function() {
        var me = this,
            boatStore = CreateStore("raceboat"),
            raceStore = CreateStore("race"),
            messageStore = CreateStore("racemessage"),
            raceStore = CreateStore("race"),
            raceCompletionStore = CreateStore("racecompletion");

        this.callParent();

        boatStore.execConfig({
            params: {
                entityViewID: GetEntityViewByName('BR').entityviewid ,
                filters: ''
            }
        });

        raceStore.execConfig({
            params: {
                entityViewID: GetEntityViewByName('Races').entityviewid ,
                filters: 'WHERE cast(startdate as date) = curdate()'
            }
        });

        //boatStore.filter('raceid', '0');
        messageStore.execConfig({
            params: {
                entityViewID: GetEntityViewByName('Race Messages').entityviewid ,
                filters: ''//WHERE cast(startdate as date) = curdate()'
            }
        });

        raceCompletionStore.execConfig({
            params: {
                entityViewID: GetEntityViewByName('Race Completion').entityviewid ,
                filters: ''//WHERE cast(startdate as date) = curdate()'
            }
        });

        me.raceCompletionStore = raceCompletionStore;

        me.down('#racesSignOnList').setStore(raceStore);
        me.down('#portalRacesList').setStore(raceStore);

        me.down('#messagesList').setStore(messageStore);
        me.down('#raceBoatsList').setStore(messageStore);
        me.down('#boatNumberCmb').setStore(boatStore);


        me.down('#weatherCmp').updateHtml('<div class="weather-widget"><h3>Sydney, AU</h3><h2> <img src="http://openweathermap.org/img/w/09n.png"> 13 °C</h2>'
        +'Rain<p></p><div id="date_m"></div><p></p></div>                                  ');
        //me.down('#raceDivisionsReviewList').setStore(seriesDivisionsStore);
    }

});