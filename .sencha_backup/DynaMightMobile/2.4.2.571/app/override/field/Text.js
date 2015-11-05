Ext.define('DynaMightMobile.override.field.Text', {
    override: 'Ext.field.Text',
    
    onKeyUp: function(e){
        var element = this.element;

        this.fireAction('keyup', [this, e], 'doKeyUp');

        if (!element.hasCls('backgroundtext')) {
            element.addCls('backgroundtext');
        }
    }
    
});
