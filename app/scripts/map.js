/* eslint no-underscore-dangle: 0  */
/* global app, bus */
(function () {
  'use strict';


  Vue.component('map-controls', {
    template: '#map-controls-template',
    props: {
      map: {
        type: Object
      }
    },
    data: function() {
      return {
        locked: true
      };
    },
    watch: {
      locked: 'lockedChanged'
    },
    mounted: function() {

      $('#lockmap').on('switchChange.bootstrapSwitch', () => {
        if ($('#lockmap').is(':checked')) {
          this.locked = true;
        } else {
          this.locked = false;
        }
      });
    },
    methods: {
      lockedChanged: function(oldVal, newVal) {
        if (newVal) {
          this.lockMap();
        } else {
          this.unlockMap();
        }
      },
      lockMap: function() {
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



  Vue.component('map-container', {
    // overwrite data in object constructor
    template: '<div id="map" :class="{\'sidebar-map\': sidebar}"></div>',
    props: {
      model: Object,
      sidebar: {
        type: Boolean,
        default: function() { return true; }
      }
    },
    data: function() {
      return {
        map: this.$root.map,
        layers: []
      };
    },
    mounted: function(){
      this.createMap();
    },
    methods: {
      createMap: function() {
        L.mapbox.accessToken = 'pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA';
        var map = L.mapbox.map('map', 'siggyf.c74e2e04');

        // add the sidebar
        if (this.sidebar) {
          L.control.sidebar('sidebar').addTo(map);

        }

        var ToggleControl = L.Control.extend({
          options: {
            position: 'topright'
          },

          onAdd: function () {
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
        var drawToggle = new ToggleControl({});
        drawToggle.addTo(map);
        Vue.set(this.$root, 'map', map);
        this.map = map;
      },
      loadModel: function() {
        var layers = this.layers;
        var map = this.map;
        var model = this.model;
        // remove all layers
        while(layers.length) {
          var layer = layers.pop();
          console.log('destroying layer', layer);
          // if it is bound to vue, destroy vue object.
          if (_.has(layer, 'canvas.__vue__.$destroy')) {
            layer.canvas.__vue__.$destroy();
          } else {
            console.warn('cannot delete', layer);
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
        var modelLayer = L.imageOverlay.canvas(bounds, {id: 'webgl'}).addTo(map);
        layers.push(modelLayer);
        var drawingLayer = L.imageOverlay.canvas(bounds, {id: 'drawing'}).addTo(map);
        layers.push(drawingLayer);

        bus.$on('drawing-canvas-created', function(drawing) {
          // once a new canvas is created replace the current one with it
          drawingLayer._image = drawing.$el;
          drawingLayer.canvas = drawing.$el;
          // recreate the context
          console.log('got a new drawing canvas', drawing.$el, this.$root.$refs.modelCanvas);


        });
        bus.$on('model-canvas-created', function(modelCanvas) {
          // once a new canvas is created replace the current one with it
          modelLayer._image = modelCanvas.$el;
          modelLayer.canvas = modelCanvas.$el;
          console.log('got a new model canvas', modelCanvas.$el, this.$root.$refs.modelCanvas);
        });

        bus.$emit('model-layer-added', {
          drawingElement: drawingLayer.canvas,
          modelElement: modelLayer.canvas,
          modelLayer: modelLayer,
          model: model
        });
        bus.$emit('drawing-layer-added', {
          drawingElement: drawingLayer.canvas,
          drawingLayer: drawingLayer,
          model: model,
          map: map
        });
        var event = new CustomEvent(
          'model-layers',
          {'detail': model}
        );
        document.dispatchEvent(event);
      }
    }
  });


}());
