/* eslint no-underscore-dangle: 0  */
/* global app */
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

        $('#mapban').addClass('hide');
      }
    }
  });

  Vue.component('toggle-controls', {
    template: '#toggle-controls-template',
    props: {
      sketch: {
        type: CanvasRenderingContext2D
      }
    },
    mounted() {

      var ToggleControl = L.Control.extend({
        options: {
          position: 'topright'
        },

        onAdd: () => {
          // create the control container with a particular class name
          // var container = L.DomUtil.create('div', 'my-custom-control leaflet-control leaflet-bar');
          var container = this.$el;

          var toggleDraw = $('<a id="drawtoggle"></a>');
          toggleDraw.append($('<span class="fa-stack"><i class="fa fa-paint-brush fa-stack-1x"></i><i id="drawingban" class="hide fa fa-ban fa-stack-2x"></i></span>'));
          toggleDraw.on('click', function(){
            sketch = this.sketch;
            if (!(this.sketch)) {
              console.warn('no sketch available in', this);
              return;
            }
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
          toggleMap.append($('<span class="fa-stack"><i class="fa fa-map-o fa-stack-1x"></i><i id="mapban" class="fa hide fa-ban fa-stack-2x></i></span>'));
          toggleMap.on('click', () => {
            if (_.has(this.$root.$refs, 'mapControls.locked')) {
              app.$refs.mapControls.locked = !app.$refs.mapControls.locked;
            } else {
              console.warn('no mapControls available');
            }
          });
          $(container).append(toggleMap);




          return container;
        }
      });
      this.$drawToggle = new ToggleControl({});
    },
    methods: {

      deferredMountedTo(parent) {
        this.$drawToggle.addTo(parent);
        _.forEach(this.$children, (child) => {
          child.deferredMountedTo(this.$drawToggle);
        });
      }
    }


  });

  Vue.component('canvas-layer', {
    template: '#canvas-layer-template',
    props: {
      model: {
        type: Object
      }
    },
    watch: {
      bounds: function() {
        // set bounds on image if they change
        this.setBounds();
      }
    },
    mounted: function() {
      // some random bounds, reset later
      var bounds = this.bounds;
      this.$drawingLayer = L.canvasOverlay(bounds, {el: this.$el, width: 1024, height: 1024});
    },
    computed: {
      bounds: {
        get: function() {
          var bounds = L.latLngBounds(L.latLng(0, 0), L.latLng(1, 1));
          if (_.has(this, 'model.extent')) {
            var model = this.model;
            var sw = L.latLng(model.extent.sw[0], model.extent.sw[1]),
                ne = L.latLng(model.extent.ne[0], model.extent.ne[1]);
            bounds = L.latLngBounds(sw, ne);
          }
          return bounds;
        },
        cache: false
      }
    },
    methods: {
      deferredMountedTo(parent) {
        this.$drawingLayer.addTo(parent);
        _.forEach(this.$children, (child) => {
          child.deferredMountedTo(this.$drawingLayer);
        });
      },
      setBounds: function() {
        this.$drawingLayer.setBounds(this.bounds);

      }

    }
  });



}());
