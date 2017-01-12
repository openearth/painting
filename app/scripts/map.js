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
          var app = this.$root;

          var buttons = [
            {
              idbase: 'map',
              icon: 'fa-map-o',
              type: 'toggle',
              banned: 'mapControls.locked'
            },
            {
              idbase: 'clear',
              icon: 'fa-tint',
              type: 'toggle',
              banned: 'modelCanvas.keepPaint'
            },
            {
              idbase: 'clear',
              icon: 'fa-eraser',
              type: 'button',
              actions: [
                'modelCanvas.clear',
                'particleComponent.clear'
              ]
            },
            {
              idbase: 'addparticle',
              icon: 'fa-tencent-weibo',
              type: 'button',
              actions: [
                'particleComponent.add'
              ]
            },
            {
              idbase: 'addgrid',
              icon: 'fa-th',
              type: 'button',
              actions: [
                'drawingCanvas.grid'
              ]
            },
            {
              idbase: 'addquiver',
              icon: 'fa-long-arrow-right',
              type: 'button',
              actions: [
                'drawingCanvas.quiver'
              ]
            }
          ];
          _.each(buttons, function(button) {
            var a = $('<a href=""></a>');
            a.attr('id', button.idbase + button.type);
            var icon = $('<i class="fa fa-stack-1x"></i>');
            icon.addClass(button.icon);
            if (button.type === 'toggle') {
              var span = $('<span class="fa-stack"></span>');
              span.append(icon);
              var ban = $('<i class="fa fa-ban fa-stack-2x"></i>');
              ban.attr('id', button.idbase + 'ban');
              if (!_.get(app.$refs, button.banned)) {
                // hide until banned
                ban.addClass('hidden');
              }
              span.append(ban);
              a.append(span);
            } else if (button.type === 'button') {
              a.append(icon);
            }
            a.on('dblclick', function(evt) {
              evt.stopImmediatePropagation();
              console.log('caught dbl', evt);
              return false;
            });

            a.on('click', function(evt) {
              if (button.type === 'toggle') {
                // toggle
                _.set(
                  app.$refs,
                  button.banned,
                  !(_.get(app.$refs, button.banned))
                );
                if (!_.has(app.$refs, button.banned)) {
                  console.warn('Could not find', button.banned);
                  return;
                }
                // get current valeu
                var banned = _.get(app.$refs, button.banned);
                // lookup element
                var banElement = $('#' + button.idbase + 'ban');
                if (banned) {
                  banElement.addClass('hidden');
                } else {
                  banElement.removeClass('hidden');
                }

              }
              if (button.type === 'button') {
                _.each(button.actions, function(action) {
                  if (!_.has(app.$refs, action)) {
                    console.warn('Could not find', action);
                    return;
                  }
                  _.get(app.$refs, action)();

                });
              }
              // don't bubble to the map (no painting)
              evt.stopPropagation();
              return false;
            });
            $(container).append(a);

          });


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
