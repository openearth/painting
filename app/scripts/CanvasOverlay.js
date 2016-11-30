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

L.CanvasOverlay = L.Layer.extend({

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
    interactive: false,

    // @option crossOrigin: Boolean = false
    // If true, the canvas will have its crossOrigin attribute set to ''. This is needed if you want to access canvas pixel data.
    crossOrigin: false
  },

  initialize: function (bounds, options) { // (String, LatLngBounds, Object)
    if (bounds) {
      this._bounds = L.latLngBounds(bounds);
    } else {
      this._bounds = null;
    }
    this._zoomAnimated = true;
    L.setOptions(this, options);
  },

  onAdd: function () {
    if (!this._canvas) {
      this._initCanvas();

      if (this.options.opacity < 1) {
        this._updateOpacity();
      }
    }

    if (this.options.interactive) {
      L.DomUtil.addClass(this._canvas, 'leaflet-interactive');
      this.addInteractiveTarget(this._canvas);
    }

    this.getPane().appendChild(this._canvas);
    this._reset();
  },

  onRemove: function () {
    L.DomUtil.remove(this._canvas);
    if (this.options.interactive) {
      this.removeInteractiveTarget(this._canvas);
    }
  },

  // @method setOpacity(opacity: Number): this
  // Sets the opacity of the overlay.
  setOpacity: function (opacity) {
    this.options.opacity = opacity;

    if (this._canvas) {
      this._updateOpacity();
    }
    return this;
  },

  setStyle: function (styleOpts) {
    if (styleOpts.opacity) {
      this.setOpacity(styleOpts.opacity);
    }
    return this;
  },

  // @method bringToFront(): this
  // Brings the layer to the top of all overlays.
  bringToFront: function () {
    if (this._map) {
      L.DomUtil.toFront(this._canvas);
    }
    return this;
  },

  // @method bringToBack(): this
  // Brings the layer to the bottom of all overlays.
  bringToBack: function () {
    if (this._map) {
      L.DomUtil.toBack(this._canvas);
    }
    return this;
  },

  setBounds: function (bounds) {
    this._bounds = bounds;

    if (this._map) {
      this._reset();
    }
    return this;
  },

  getEvents: function () {
    var events = {
      zoom: this._reset,
      viewreset: this._reset
    };

    if (this._zoomAnimated) {
      events.zoomanim = this._animateZoom;
    }

    return events;
  },

  getBounds: function () {
    return this._bounds;
  },

  getElement: function () {
    return this._canvas;
  },

  _initCanvas: function () {
    var canvas;
    if (this.options.el) {
      canvas = this._canvas = this.options.el;
    } else if (this.options.id) {
      canvas = this._canvas = document.getElementById(this.options.id);
    } else {
      canvas = this._canvas = L.DomUtil.create(
        'canvas',
        'leaflet-canvas-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : '')
      );

    }

    canvas.onselectstart = L.Util.falseFn;
    canvas.onmousemove = L.Util.falseFn;

    canvas.onload = L.bind(this.fire, this, 'load');

    if (this.options.crossOrigin) {
      canvas.crossOrigin = '';
    }

  },

  _animateZoom: function (e) {
    var scale = this._map.getZoomScale(e.zoom),
        offset = this._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;

    L.DomUtil.setTransform(this._canvas, offset, scale);


    // var bounds = new L.Bounds(
    //   this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
    //   this._map.latLngToLayerPoint(this._bounds.getSouthEast())
    // );
    // var size = bounds.getSize();
    // this._canvas.style.width  = size.x + 'px';
    // this._canvas.style.height = size.y + 'px';

  },
  _latLngBoundsToNewLayerBounds: function (latLngBounds, zoom, center) {
    var topLeft = this._map._getNewPixelOrigin(center, zoom);
    return L.bounds([
      this._map.project(latLngBounds.getSouthWest(), zoom)._subtract(topLeft),
      this._map.project(latLngBounds.getNorthWest(), zoom)._subtract(topLeft),
      this._map.project(latLngBounds.getSouthEast(), zoom)._subtract(topLeft),
      this._map.project(latLngBounds.getNorthEast(), zoom)._subtract(topLeft)
    ]);
  },
  _reset: function () {
    var canvas = this._canvas,
        bounds = new L.Bounds(
          this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
          this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
        size = bounds.getSize();

    L.DomUtil.setPosition(canvas, bounds.min);

    // number of pixels in the canvas (independent of display size)
    // TODO: fullscreen by default
    canvas.width = this.options.width;
    canvas.height = this.options.height;

    canvas.style.width  = size.x + 'px';
    canvas.style.height = size.y + 'px';
  },

  _updateOpacity: function () {
    L.DomUtil.setOpacity(this._canvas, this.options.opacity);
  }
});

// @factory L.canvasOverlay(bounds: LatLngBounds, options?: CanvasOverlay options)
// Instantiates an canvas overlay object given the
// geographical bounds it is tied to.
L.canvasOverlay = function (bounds, options) {
  return new L.CanvasOverlay(bounds, options);
};
