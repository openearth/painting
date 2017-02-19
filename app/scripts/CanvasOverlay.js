/* eslint-disable no-underscore-dangle */
/*
 * @class CanvasOverlay
 * @aka L.canvasOverlay
 * @inherits Interactive layer
 *
 * Used to load and display a single canvas over specific bounds of the map. Extends `Layer`.
 *
 * @example
 *
 * ```js
 * var bounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
 * L.canvasOverlay({bounds: bounds}).addTo(map);
 * ```
 */

L.CanvasOverlay = L.ImageOverlay.extend({

  // @section
  // @aka CanvasOverlay options
  options: {
    // @option opacity: Number = 1.0
    // The opacity of the canvas overlay.
    opacity: 1,

    // @option id: String = ''
    // The id for the element to use
    id: '',

    // @option el: Object = null
    // The element to use

    // @option interactive: Boolean = false
    // If `true`, the canvas overlay will emit [mouse events](#interactive-layer) when clicked or hovered.
    interactive: true,

    // @option crossOrigin: Boolean = false
    // If true, the canvas will have its crossOrigin attribute set to ''. This is needed if you want to access canvas pixel data.
    crossOrigin: false
  },

  initialize: function (bounds, options) { // (LatLngBounds, Object)
    'use strict';
    if (bounds) {
      this._bounds = L.latLngBounds(bounds);
    } else {
      this._bounds = null;
    }
    L.setOptions(this, options);
  },

  _initImage: function () {
    'use strict';
    var canvas;
    if (this.options.el) {
      canvas = this._image = this.options.el;
    } else if (this.options.id) {
      canvas = this._image = document.getElementById(this.options.id);
    } else {
      canvas = this._image = L.DomUtil.create(
        'canvas',
        'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : '')
      );

    }

    canvas.onselectstart = L.Util.falseFn;
    canvas.onmousemove = L.Util.falseFn;

    canvas.onload = L.bind(this.fire, this, 'load');

    if (this.options.crossOrigin) {
      canvas.crossOrigin = '';
    }

  },

  _reset: function () {
    'use strict';
    L.ImageOverlay.prototype._reset.call(this);
    var canvas = this._image;
    // number of pixels in the canvas (independent of display size)
    // TODO: fullscreen by default
    if (canvas.width !== this.options.width) {
      canvas.width = this.options.width;
    }
    if (canvas.height !== this.options.height) {
      canvas.height = this.options.height;
    }

  }
});

// @factory L.canvasOverlay(bounds: LatLngBounds, options?: CanvasOverlay options)
// Instantiates an canvas overlay object given the
// geographical bounds it is tied to.
L.canvasOverlay = function (bounds, options) {
  'use strict';
  return new L.CanvasOverlay(bounds, options);
};
