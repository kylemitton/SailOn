/*
 * File: app/controller/RaceResults.js
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

Ext.define('DynaMightMobile.controller.RaceResults', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            resNextBtn: 'button#resNextBtn',
            raceResults: 'formpanel#handicapWizardId',
            resBoatSearch: 'searchfield#resBoatSearch',
            resDivisionCmb: 'selectfield#resDivisionCmb',
            resRaceCmb: 'selectfield#resRaceCmb'
        },

        control: {
            "list#resCurrentSeriesList": {
                select: 'onCurrentListSelect'
            },
            "button#resNextBtn": {
                tap: 'onResNextButtonTap'
            },
            "selectfield#resDivisionCmb": {
                change: 'onDivisionSelectfieldChange'
            },
            "searchfield#resBoatSearch": {
                keyup: 'onSearchfieldKeyup'
            },
            "selectfield#resRaceCmb": {
                change: 'onRaceSelectfieldChange'
            },
            "button#resDoneBtn": {
                tap: 'onBackButtonTap'
            }
        }
    },

    onCurrentListSelect: function(dataview, record, eOpts) {
        var me = this;

        me.getResNextBtn().setDisabled(false);
        me.series = record;
    },

    onResNextButtonTap: function(button, e, eOpts) {
        var me = this;

        //me.getRaceResults().raceList.

        me.getRaceResults().raceStore.filter([{
            filterFn: function(item) {
                //debugger;
                return item.get("raceseriesid") == me.series.get('raceseriesid') ;
            }}
        ]);

        me.getRaceResults().boatStore.filter([{
            filterFn: function(item) {
                //debugger;
                return item.get("raceseriesid") == me.series.get('raceseriesid') ;
            }}
        ]);

        /*
        me.getResDivisionCmb().getStore().clearFilter(true);
        me.getResDivisionCmb().getStore().execConfig({
            params: {
                entityViewID: GetEntityViewByName('DivisionsByRace').entityviewid ,
                filters: "where raceid is null or raceseriesid = '"+me.series.get('raceseriesid')+"' order by name asc"
            }
        });
        */
        me.getRaceResults().showSeriesView(3, true);
        me.getRaceResults().showRaceView(3, true);

        me.jumpCards(1);
    },

    onDivisionSelectfieldChange: function(selectfield, newValue, oldValue, eOpts) {
        this.applyFilters();
    },

    onSearchfieldKeyup: function(textfield, e, eOpts) {
        this.applyFilters();
    },

    onRaceSelectfieldChange: function(selectfield, newValue, oldValue, eOpts) {
        this.applyFilters();

    },

    onBackButtonTap: function(button, e, eOpts) {
        this.jumpCards(-1);
    },

    jumpCards: function(no, cardNo) {
        var me = this, vals,
            wizard = me.getRaceResults(),
            selectedIndex = wizard.items.indexOf(wizard._activeItem);

        no = no ? (selectedIndex + no) : cardNo;

        wizard.setActiveItem(no);
    },

    applyFilters: function() {
        //debugger;
        if (!this.getRaceResults().down('#resSeriesGrid'))
            return;
        var me = this,
            filters = [],
            division = me.getResDivisionCmb().getValue(),
            race = me.getResRaceCmb().getValue(),
            val = me.getResBoatSearch().getValue(),
            store = me.getRaceResults().down('#resSeriesGrid').getStore(),
            raceStore = me.getRaceResults().down('#resRaceGrid').getStore();

        store.clearFilter(true);
        raceStore.clearFilter(true);


        if(division){
            filters.push({property: 'divisionid', value: division});
        }
        //debugger;
        if(val){
            filters.push({property: 'bname', value: val});
        }

        store.filter(filters);

        if(race){
            filters.push({property: 'raceid', value: race});
        }
        raceStore.filter(filters);
    }

});