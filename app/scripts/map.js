/* eslint no-underscore-dangle: 0 */
'use strict';
var layers = [];

/*
 * L.ImageOverlay.Canvas is used to overlay images over the map (to specific geographical bounds).
 */
L.ImageOverlay.Canvas = L.ImageOverlay.extend({
    includes: L.Mixin.Events,

    // The width and height relate to the drawing canvas
    // This is independent of the size of the canvas on the screen
    options: {
        width: 1024,
        height: 1024
    },

    // We need a bounding box where we're drawing on
    initialize: function (bounds, options) { // (LatLngBounds, Object)
        this._bounds = L.latLngBounds(bounds);

        L.Util.setOptions(this, options);
    },

    // Here we overwrite the _initImage so we correctly place the canvas on the screen.
    _initImage: function () {
        var topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest());
        var bottomRight = this._map.latLngToLayerPoint(this._bounds.getSouthEast());
        var size = bottomRight._subtract(topLeft);

        // The image is the canvas
        this._image = this.canvas = L.DomUtil.create('canvas', 'leaflet-image-layer');
        if (this.options.id) {
            this._image.id = this.options.id;
        }
        // Set the width and height properties, custom or depending on view size
        this._image.width = this.options.width || size.x;
        this._image.height = this.options.width || size.y;

        if (this._map.options.zoomAnimation && L.Browser.any3d) {
            L.DomUtil.addClass(this._image, 'leaflet-zoom-animated');
        } else {
            L.DomUtil.addClass(this._image, 'leaflet-zoom-hide');
        }

        this._updateOpacity();

        //TODO createImage util method to remove duplication
        L.Util.extend(this._image, {
            galleryimg: 'no',
            onselectstart: L.Util.falseFn,
            onmousemove: L.Util.falseFn,
            onload: L.Util.bind(this._onImageLoad, this)
        });
    },

    _reset: function () {
        var image = this._image;
        var topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest());
        var bottomRight = this._map.latLngToLayerPoint(this._bounds.getSouthEast());
        // recompute the size
        var size = bottomRight._subtract(topLeft);

        image.width = this.options.width || size.x;
        image.height = this.options.width || size.y;

        // reposition the image on reset
        L.DomUtil.setPosition(image, topLeft);

        // rescale in view
        image.style.width = size.x + 'px';
        image.style.height = size.y + 'px';

    },

    // Not sure if canvas also has a load event...
    _onImageLoad: function () {
        this.fire('load');
    }
});

L.imageOverlay.canvas = function (bounds, options) {
    // Constructor function is lower case by default.
    return new L.ImageOverlay.Canvas(bounds, options);
};

function loadModel(map, model) {
    // remove all layers
    while(layers.length) {
        var layer = layers.pop();
        console.log('removing', layer);
        map.removeLayer(layer);
    }

    var sw = L.latLng(model.extent.sw[0], model.extent.sw[1]),
        ne = L.latLng(model.extent.ne[0], model.extent.ne[1]);
    var bounds = L.latLngBounds(sw, ne);
    map.fitBounds(
        bounds,
        {
            animate: true
        }
    );
    layers.push(L.imageOverlay.canvas(bounds, {id: 'webgl'}).addTo(map));
    layers.push(L.imageOverlay.canvas(bounds, {id: 'drawing'}).addTo(map));
}

$(function(){
    L.mapbox.accessToken = 'pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA';
    var map = L.mapbox.map('map', 'siggyf.c74e2e04');

    // add the sidebar
    L.control.sidebar('sidebar').addTo(map);

    // Listen for selected models
    document.addEventListener('model-selected', function(evt) {
        var model = evt.detail;
        console.log('model selected', model);
        loadModel(map, model);
        // layers available
        var event = new CustomEvent(
            'model-layers',
            {'detail': model}
        );
        document.dispatchEvent(event);
    });

});


