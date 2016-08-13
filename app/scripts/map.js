(function () {

  /*  eslint no-underscore-dangle: 0  */
  /* global: sketch */

  Vue.component('map-controls', {
    template: '#map-controls-template',
    props: ['map'],
    data: function() {
      return {
        locked: true
      };
    },
    watch: {
      locked: 'locked'
    },
    ready: function() {

      $('#lockmap').on('switchChange.bootstrapSwitch', (evt) => {
        if ($('#lockmap').is(':checked')) {
          this.locked = true;
        } else {
          this.locked = false;
        }
      });
    },
    methods: {
      locked: function(oldVal, newVal) {
        if (newVal) {
          this.lockMap();
        } else {
          this.unlockMap();
        }
      },
      lockMap: function() {
        'use strict';
        var map = this.map;
        // Disable drag and zoom handlers.
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();

        // Disable tap handler, if present.
        if (map.tap) {
          map.tap.disable();
        }
        $('#lockmap').bootstrapSwitch('state', true, true);
        $('#mapban').removeClass('hide');

      },
      unlockMap: function() {
        'use strict';
        var map = this.map;
        // Disable drag and zoom handlers.
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
        // Disable tap handler, if present.
        if (map.tap) {
          map.tap.enable();
        }
        $('#lockmap').bootstrapSwitch('state', false, true);

        $('#mapban').addClass('hide');
      }
    }
  });

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
      'use strict';
      this._bounds = L.latLngBounds(bounds);

      L.Util.setOptions(this, options);
    },

    // Here we overwrite the _initImage so we correctly place the canvas on the screen.
    _initImage: function () {
      'use strict';
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
      'use strict';
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
      'use strict';
      this.fire('load');
    }
  });

  L.imageOverlay.canvas = function (bounds, options) {
    'use strict';
    // Constructor function is lower case by default.
    return new L.ImageOverlay.Canvas(bounds, options);
  };

  function loadModel(map, model) {
    'use strict';
    // remove all layers
    while(layers.length) {
      var layer = layers.pop();
      console.log('destroying layer', layer);
      // if it is bound to vue, destroy vue object.
      if (_.has(layer, 'canvas.__vue__')) {
        layer.canvas.__vue__.$destroy();
      }
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
    var drawingLayer = L.imageOverlay.canvas(bounds, {id: 'drawing'}).addTo(map);
    layers.push(drawingLayer);
    bus.$emit('drawing-layer-added', {
      drawingElement: drawingLayer.canvas,
      drawingLayer: drawingLayer,
      model: model,
      map: map
    });
  }



  var ToggleControl = L.Control.extend({
    options: {
      position: 'topright'
    },

    onAdd: function (map) {
      'use strict';
      // create the control container with a particular class name
      var container = L.DomUtil.create('div', 'my-custom-control leaflet-control leaflet-bar');

      var toggleDraw = $('<a id="drawtoggle"></a>');
      toggleDraw.append($('<span class="fa-stack"><i class="fa fa-paint-brush fa-stack-1x"></i><i id="drawingban" class="hide fa fa-ban fa-stack-2x"></i></span>'));
      toggleDraw.on('click', function(){
        sketch.painting = !sketch.painting;
        if (sketch.painting) {
          $('#drawing').addClass('crosshair');
          $('#drawingban').addClass('hide');
        }
        else {
          $('#drawing').removeClass('crosshair');
          $('#drawingban').removeClass('hide');
        }

      });
      $(container).append(toggleDraw);

      var toggleMap = $('<a id="maptoggle"></a>');
      toggleMap.append($('<span class="fa-stack"><i class="fa fa-map-o fa-stack-1x"></i><i id="mapban" class="fa hide fa-ban fa-stack-2x"></i></span>'));
      toggleMap.on('click', function(){
        app.$refs.mapControls.locked = !app.$refs.mapControls.locked;
      });
      $(container).append(toggleMap);




      return container;
    }
  });


  $(function(){
    'use strict';
    L.mapbox.accessToken = 'pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA';
    var map = L.mapbox.map('map', 'siggyf.c74e2e04');

    // add the sidebar
    L.control.sidebar('sidebar').addTo(map);

    var drawToggle = new ToggleControl({});
    drawToggle.addTo(map);

    bus.$emit('map-created', map);

    // Listen for selected models
    document.addEventListener('model-selected', function(evt) {
      var model = evt.detail;
      loadModel(map, model);
      // layers available
      var event = new CustomEvent(
        'model-layers',
        {'detail': model}
      );
      document.dispatchEvent(event);
    });


  });

}());
