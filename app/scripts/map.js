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

    data() {
      return {
        toggleButtons: [
          {
            id: 'maptoggle',
            icon: 'fa-map-o',
            type: 'toggle',
            banned: 'mapControls.locked'
          },
          {
            id: 'cleartoggle',
            icon: 'fa-tint',
            type: 'toggle',
            banned: 'modelCanvas.clearAfterRender'
          }
        ],
        actionButtons: [
          {
            id: 'clearcanvas',
            icon: 'fa-eraser',
            type: 'button',
            actions: [
              'modelCanvas.clear',
              'particleComponent.clear'
            ]
          },
          {
            id: 'addparticle',
            icon: 'fa-tencent-weibo',
            type: 'button',
            actions: [
              'particleComponent.add'
            ]
          },
          {
            id: 'addgrid',
            icon: 'fa-th',
            type: 'button',
            actions: [
              'drawingCanvas.grid'
            ]
          },
          {
            id: 'addquiver',
            icon: 'fa-long-arrow-right',
            type: 'button',
            actions: [
              'drawingCanvas.quiver'
            ]
          }
        ]
      };
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
          var app = this.$root;
          return container;
        }
      });

      this.controls = [
        new ToggleControl({})
      ];
    },
    methods: {
      toggle(button, evt) {
        _.set(
          app.$refs,
          button.banned,
          !(_.get(app.$refs, button.banned))
        );
      },
      action(button, evt) {
        _.each(button.actions, (action) => {
          _.get(app.$refs, action)();
        });
      },
      isBanned(button) {
        var app = this.$root;
        return _.get(app.$refs, button.banned);
      },
      deferredMountedTo(parent) {
        _.forEach(
          this.controls,
          (control) => { control.addTo(parent); }
        );
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
