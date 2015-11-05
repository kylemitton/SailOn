//Ext JS Kitchen Sink

Ext.define('Ext.form.ColorPickerController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.form-color-picker',

    onChange: function(picker) {
        console.log(picker.getId() + '.color: ' + picker.getValue());
    },

    onShowMoreLess: function (button) {
        this.getViewModel().set('full', button.value);
    }
});

