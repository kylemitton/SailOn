AJAX_URL = '';
AJAX_HANDLER = 'AJAXHandler.php';

D_FORMAT = 'd M Y';

WORKFORCE_TEMPLATE =  '';

function _T(val)
{
    var v = APP.Resources[val];
    return v ? v : val;
}


function GETDATA(values){
    //debugger;
    if(!values) return [];
    var ret = [];
    var fields = values.split(',');
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        ret.push([field, field]);
        
    }
    return ret;
}

function GetDisplayField(fields){
    for (var i = 0; i < fields.length; i++) {
        if(fields[i].name.indexOf('id') == -1)
            return fields[i].name;
            //return '{' + fields[i].name + '}'
    }
    return '';
}

function GetEntityView(EntityID){
    var objs = APP.Menu;
    for (var i = 0; i < objs.length; i++) {
        if(objs[i].entityid == EntityID)
            return objs[i];
    }
    return '';
}


function GetStringFromArray(values){
    var ret = "";
    var fields = values.split(',');
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        ret.push([field, field]);
        
    }
    return ret;
}

function GetEntityViewByViewName(name){
    var objs = APP.Menu;
    for (var i = 0; i < objs.length; i++) {
        if(objs[i].name == name)
            return objs[i];
    }
    return '';
}

function GetEntityViewByName(Name){
    var objs = APP.Menu;
    for (var i = 0; i < objs.length; i++) {
        if(objs[i].entityname == Name)
            return objs[i];
    }
    return '';
}

Ext.override(Ext.form.HtmlEditor, {
    setValue: function(value) {
        var me = this,
            textarea = me.textareaEl,
            inputCmp = me.inputCmp;
            
        me.mixins.field.setValue.call(me, value);
        if (value === null || value === undefined) {
            value = '';
        }
        if (textarea) {
            textarea.dom.value = value;
        }
        me.pushValue();
        
        if (!me.rendered && me.inputCmp) {
            me.inputCmp.data.value = value;
        }
        
        return me;
    }
});