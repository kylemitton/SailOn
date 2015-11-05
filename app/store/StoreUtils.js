function AJAXCommand(config)
{

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

