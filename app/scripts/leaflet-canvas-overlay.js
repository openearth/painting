/* eslint-disable no-underscore-dangle */
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
    'use strict';
    L.ImageOverlay.prototype.initialize.call(this, bounds, options);
    this._bounds = L.latLngBounds(bounds);

    L.Util.setOptions(this, options);

    // The image is the canvas
    if (this.options.el) {
      this._image = this.canvas = this.options.el;
    } else {
      this._image = this.canvas = L.DomUtil.create('canvas', 'leaflet-image-layer');
    }

    if (this.options.id) {
      this._image.id = this.options.id;
    }
  },

  // Here we overwrite the _initImage so we correctly place the canvas on the screen.
  _initImage: function () {
    'use strict';
    var _map = this._map || this._mapToAdd;
    var topLeft = _map.latLngToLayerPoint(this._bounds.getNorthWest());
    var bottomRight = _map.latLngToLayerPoint(this._bounds.getSouthEast());
    var size = bottomRight._subtract(topLeft);

    // Set the width and height properties, custom or depending on view size
    this._image.width = this.options.width || size.x;
    this._image.height = this.options.width || size.y;

    if (_map.options.zoomAnimation && L.Browser.any3d) {
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
    'use strict';
    this._initImage();

    var image = this._image;
    var _map = this._map || this._mapToAdd;

    var topLeft = _map.latLngToLayerPoint(this._bounds.getNorthWest());
    var bottomRight = _map.latLngToLayerPoint(this._bounds.getSouthEast());
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
  _layerAdd: function() {
    'use strict';
    console.log('adding layer', this);
  },
  // Not sure if canvas also has a load event...
  _onImageLoad: function () {
    'use strict';
    this.fire('load');
  }
});

L.imageOverlay.canvas = function (bounds, options) {
  'use strict';
  // Constructor function is lower case by default.
  return new L.ImageOverlay.Canvas(bounds, options);
};
