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
        $('#mapban').removeClass('hidden');

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

        $('#mapban').addClass('hidden');
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

          var toggleMap = $('<a id="maptoggle" href=""></a>');
          // add a button with a default hidden ban
          toggleMap.append($('<span class="fa-stack"><i class="fa fa-map-o fa-stack-1x"></i><i id="mapban" class="hidden fa fa-ban fa-stack-2x"></i></span>'));
          toggleMap.on('click', (evt) => {
            if (_.has(this.$root.$refs, 'mapControls.locked')) {
              app.$refs.mapControls.locked = !(app.$refs.mapControls.locked);
              if (app.$refs.mapControls.locked) {
                $('#mapban').addClass('hidden');
              } else {
                $('#mapban').removeClass('hidden');
              }

            } else {
              console.warn('no mapControls available');
            }
            // don't bubble to the map (no painting)
            evt.stopPropagation();
            // don't go to the href
            return false;
          });
          $(container).append(toggleMap);


          var toggleClear = $('<a id="cleartoggle" href=""></a>');
          // add a button with a default hidden ban
          toggleClear.append($('<span class="fa-stack"><i class="fa fa-eraser fa-stack-1x" aria-hidden="true"></i><i id="clearban" class="hidden fa fa-ban fa-stack-2x"></i></span>'));
          toggleClear.on('click', (evt) => {
            if (_.has(this.$root.$refs, 'modelCanvas.clearAfterRender')) {
              app.$refs.modelCanvas.clearAfterRender = !(app.$refs.modelCanvas.clearAfterRender);
              if (app.$refs.modelCanvas.clearAfterRender) {
                $('#clearban').addClass('hidden');
              } else {
                $('#clearban').removeClass('hidden');
              }

            } else {
              console.warn('no modelCanvas available');
            }
            // don't bubble to the map (no painting)
            evt.stopPropagation();
            // don't go to the href
            return false;
          });
          $(container).append(toggleClear);

          var clearButton = $('<a id="clearbutton" href=""></a>');
          // add a button with a default hidden ban
          clearButton.append($('<i class="fa fa-trash-o fa-stack-1x" aria-hidden="true"></i>'));
          clearButton.on('click', (evt) => {
            if (_.has(this.$root.$refs, 'modelCanvas.clear')) {
              app.$refs.modelCanvas.clear();

            } else {
              console.warn('no modelCanvas available');
            }
            // don't bubble to the map (no painting)
            evt.stopPropagation();
            // don't go to the href
            return false;
          });
          $(container).append(clearButton);


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
