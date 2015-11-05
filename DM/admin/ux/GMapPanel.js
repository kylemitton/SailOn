/**
 * @author Shea Frederick
 */
Ext.define('Ext.ux.GMapPanel', {
    extend: 'Ext.panel.Panel',
    
    alias: 'widget.gmappanel',
    
    requires: ['Ext.window.MessageBox'],
    initComponent : function(){
        Ext.applyIf(this,{
            plain: true,
            gmapType: 'map',
            border: false
        });
        
        this.callParent();        
    },
    
    afterFirstLayout : function(){
        var center = this.center;
        this.callParent();       
        
        if (center) {
            if (center.geoCodeAddr) {
                this.lookupCode(center.geoCodeAddr, center.marker);
            } else {
                this.createMap(center);
            }
        } else {
            Ext.Error.raise('center is required');
        }
              
    },
    
    createMap: function(center, marker) {
        var options = Ext.apply({}, this.mapOptions);
        
        options = Ext.applyIf(options, {
            zoom: 17,
            center: center,
            mapTypeId: google.maps.MapTypeId.ROADMAP 
        });
        this.gmap = new google.maps.Map(this.body.dom, options);
        if (marker) {
            this.addMarker(Ext.applyIf(marker, {
                position: center
            }));
        }
        
        Ext.each(this.markers, this.addMarker, this);
        //custom
        this.addMarkers();
        //
        this.fireEvent('mapready', this, this.gmap);
    },
    
    addMarker: function(marker) {
        marker = Ext.apply({
            map: this.gmap
        }, marker);
        
        if (!marker.position) {
            marker.position = new google.maps.LatLng(marker.lat, marker.lng);
        }
        var o =  new google.maps.Marker(marker);
        Ext.Object.each(marker.listeners, function(name, fn){
            google.maps.event.addListener(o, name, fn);    
        });
        return o;
    },
    
    lookupCode : function(addr, marker) {
        this.geocoder = new google.maps.Geocoder();
        this.geocoder.geocode({
            address: addr
        }, Ext.Function.bind(this.onLookupComplete, this, [marker], true));
    },
    
    onLookupComplete: function(data, response, marker){
        if (response != 'OK') {
            Ext.MessageBox.alert('Error', 'An error occured: "' + response + '"');
            return;
        }
        this.createMap(data[0].geometry.location, marker);
    },
    
    afterComponentLayout : function(w, h){
        this.callParent(arguments);
        this.redraw();
    },
    
    redraw: function(){
        var map = this.gmap;
        if (map) {
            google.maps.event.trigger(map, 'resize');
        }
    },
    
    addMarkers: function(){
        var me = this;
        this.store.each(function(record)
        {
            if(!record.data.Latitude || !record.data.Longitude) return;
            //info
            var contentString = Ext.String.format(
                '<div style="width:300px;margin:0 0 20px 20px;height:90px;"><h3 id="firstHeading">{0}</h3>'+
                'Start: {1}<br/>End: {2}<br/>'+  
                'Job: {3}<br/>Minutes: {4}</div>', 
                record.data.UName, record.data.Startdate, record.data.Startdate,
                record.data.JTitle, record.data.Minutes);
            var infowindow = new google.maps.InfoWindow({
                  content: contentString
              });
            //marker
            var marker = new google.maps.Marker(
            {
                map: me.gmap,
                position: new google.maps.LatLng(record.data.Latitude, record.data.Longitude),
                //lat: record.data.Latitude,
                //lng: record.data.Longitude,
                title: record.data.UName + ' ' + record.data.JTitle,
                icon: record.data.UserAvatar ? 'uploaded_images/thumb_' + record.data.UserAvatar : 'resources/images/people.png'
            });
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(me.gmap,marker);
            });
            //ret.push(marker);
        },this);
        
    }
    
});
