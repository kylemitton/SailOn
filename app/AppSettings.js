APP = {
    Fields: [],
    User: {},
    Entities: [],
    Menu: []
};
APP.WarningUnsavedData = false;
AJAX_URL = '';
AJAX_HANDLER = '';

function GetTemplate(type, values){
    var tpl;
    if(type == 'boat'){
        tpl =
            '<div class="item" style="' + (values.signondate ? "background-color:#008A2E" : "") + '">' +
            '<div class="name">' + Ext.String.ellipsis(values.bname,20) + '</div>' +
            '<div class="vicinity">' + values.hullnumber + '</div></div>';
    }
    else if(type == 'myboat'){
        tpl =
            '<div class="item" style="' + (values.signondate ? "background-color:#008A2E" : "") + '">' +
            '<div class="name">' + Ext.String.ellipsis(values.name,50) + '</div>' +
            '<div class="vicinity">' + values.hullnumber + '</div></div>';
    }
    else if(type == 'boattime'){
        tpl =
            '<div class="item" style="' + (values.signondate ? "background-color:#008A2E" : "") + '">' +
            '<div class="name">' + Ext.String.ellipsis(values.bname,20) + '</div>' +
            '<div class="vicinity">' + values.hullnumber + ' | <b>' + values.endtime.split(' ') + ' </b></div></div>';

    }
    else if(type == 'boatadd'){
        tpl =
            '<div class="item" style="' + (values.signondate ? "background-color:#008A2E" : "") + '">' +
            '<div class="name">' + Ext.String.ellipsis(values.bname,20) + '</div>' +
            '<div class="vicinity">' + values.hullnumber + '</div></div>';

    }
    else if(type == 'menu'){
        //debugger;
        tpl =
            '<div class="menuItem" style="background-color:lightgray">' +
            //'<br/><br/><img src="http://dbstimeman.com/DM/common/'+(values.mobiletemplate ? values.mobiletemplate : 'star.png')+'" width="80px" height="80"/><br/><br/><div class="name">' + Ext.String.ellipsis(values.name,20) + '</div>' +
            //'<br/><br/><img src="{[AJAX_URL]}../common/'+(values.mobiletemplate ? values.mobiletemplate : 'star.png')+'" width="80px" height="80"/><br/><br/><div class="name">' + Ext.String.ellipsis(values.name,20) + '</div>' +
            '<br/><br/><img src="'+AJAX_URL+'../common/'+(values.mobiletemplate ? values.mobiletemplate : 'star.png')+'" width="80px" height="80"/><br/><br/><div class="name">' + Ext.String.ellipsis(values.name,20) + '</div>' +
            '</div>';

    }
    else if(type == 'raceboat'){
        tpl =
            '<div class="item" style="' + (values.signondate ? "background-color:#008A2E" : "") + '">' +
            '<div class="name">' + Ext.String.ellipsis(values.bname,20) + '</div>' +
            '<div class="vicinity">' + Ext.String.ellipsis(values.rname,25) + '</div>' +
            '<div class="vicinity">' + values.hullnumber + '</div>' +
            '<div class="vicinity">' + (values.skippername?values.skippername:" - ") + '</div></div>';

    }
    else if(type == 'race'){
        //debugger;
        tpl = '<div class="item"><div class="name">'+ values.name + '</div>' +
            '<div class="vicinity">Start time: '+values.startdate+'</div></div>';
    }
    else if(type == 'boatresult'){
        tpl =
            '<div class="item" style="' + (values.signondate ? "background-color:#008A2E" : "") + '">' +
            '<div class="name">' + values.hullnumber + '<br/>'+ Ext.String.ellipsis(values.bname,20) + '</div>' +
            '<div class="vicinity">Time: ' + (values.endtime ?  values.endtime : '') + ' </b></div>' + 
            '<div class="vicinity">Handicap: ' + (values.handicap ?  values.handicap : '') + ' </div></div>';

    }

    return tpl;

    /*
<div class="item">
    <div class="name">{bname}
    </div>
    <div class="vicinity" style="float: right;margin-left:50px;">{hullnumber}
    </div>
    <div class="icon" style={[this.getPath(values.path)]}>
    </div>


</div>
*/

}



function BoatFilter(item) {
    var v = this.getValue().toLowerCase();
    return item.get("bname").toLowerCase().indexOf(v) > -1 || item.get("hullnumber").toLowerCase().indexOf(v) > -1;
}

function IsNull(val, def){
    return val ? val : def;
}

function GetEntityView(EntityID){
    var objs = APP.Menu;
    for (var i = 0; i < objs.length; i++) {
        if(objs[i].entityid == EntityID)
            return objs[i];
    }
    return '';
}

function GetDisplayField(fields){
    for (var i = 0; i < fields.length; i++) {
        if(fields[i]._name.indexOf('id') == -1)
            return fields[i]._name;
        //return '{' + fields[i].name + '}'
    }
    return '';
}

function CreateModel(entityName, entityID){
    var fields = ['sysrowstate'],
        entityFields = '';

    //debugger;
    if(!Ext.ModelManager.isRegistered(entityName)){
        for (var i = 0; i < APP.Fields.length; i++) {
            var rec = APP.Fields[i];

            if(rec.entityid == entityID ){
                fields.push({
                    name: rec.name
                });

                if(rec.iseditable == '1'){
                    entityFields += (entityFields ? ',' : '') + rec.name;
                }
            }


        }

        Ext.define(entityName ,{
            extend: 'Ext.data.Model',
            requires: [
                //'Ext.data.proxy.Sql'
            ],
            config:{
                fields: fields,
                entityFields: entityFields
            },
            entityFields: entityFields
        });

    }

    return fields;
}

function GetEntityView(EntityID){
    var objs = APP.Menu;
    for (var i = 0; i < objs.length; i++) {
        if(objs[i].entityid == EntityID)
            return objs[i];
    }
    return '';
}

function GetEntityByName(name){

    for (i = 0; i < APP.Entities.length; i++) {
        rec =  APP.Entities[i];

        if(rec.name == name){

            return rec;
        }
    }
    return null;
}


function CreateStore(name){

    var entity = GetEntityByName(name),
        local = localStorage.goOffline,
        type = "SQL",
        model = local? 'DynaMightMobile.model.' + entity.name + type : 'DynaMightMobile.model.' + entity.name;


    CreateModel(model, entity.entityid);

    store = new Ext.data.Store({model: model});

    return store;

}

function GetFieldsByEntity(entityID){
    var rec,
        obj, i, entityFields = '';

    for (i = 0; i < APP.Fields.length; i++) {
        rec = APP.Fields[i];

        if(rec.entityid != entityID || rec.isonlyview == "1") continue;

        entityFields += (entityFields ? ',' : '') + rec.name;

    }

    return entityFields;

}

function GetEntityViewByName(name){
    var objs = APP.Menu;
    for (var i = 0; i < objs.length; i++) {
        if(objs[i].name == name)
            return objs[i];
    }
    return '';
}
//alert('x');


function AJAXCommand(config)
{
    if(localStorage.goOffline){
        Ext.Msg.alert('Ooops', 'You are working offline. Action could not be completed!');

        return;
    }

    var cmd = {
        object : config.object || 'Business',
        method : config.method,
        params : config.params,
        security: {
            userID: 0
            //,            userToken: APP.User ? APP.User.Token : 0
        }
    };

    var cmdText = Ext.JSON.encode( cmd );

    Ext.Ajax.request({
        url: AJAX_URL + AJAX_HANDLER,
        method: 'POST',
        params: {
            command: cmdText
        },
        scope: config.scope ? config.scope : null,
        success: function(response)
        {
            var obj = Ext.decode(response.responseText);
            if( obj.success )
            {
                if( config.callback )
                    config.callback(true, obj.message, obj, config.scope);
            }
            else
            {
                this.onFailure(response);
            }
        },
        failure: this.onFailure,
        timeout: 60000,
        onFailure: function(response, ajaxObj)
        {
            Ext.Msg.show({
                title: T('Application errorr'),
                msg: T('Application error!'),
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR,
                modal: true
            });
        },
        onSuccess: function(){}
    });
}

function replaceHTMLSpCharacters(str)
{
    if(str !== null){

        str = str.replace(/\\/g, '\\\\');
        str = str.replace(/\r/g, '\\r');
        str = str.replace(/"/g, '\\"');
    } 
    return str;        
}