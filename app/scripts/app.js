/* global Vue2Leaflet, Vuetify, urlParams, val2rgbaString  */

// app is global, prefer to use this.$root
var app;
var bus;

(function () {
  'use strict';
  var defaultColor = {
    hex: '#194d33',
    hsl: {h: 150, s: 0.5, l: 0.2, a: 1},
    hsv: {h: 150, s: 0.66, v: 0.30, a: 1},
    rgba: {r: 25, g: 77, b: 51, a: 1},
    a: 1
  };

  $(document).ready(function() {
    // make a global event bus
    bus = new Vue();
    // HACK: Vuetify is exposed as a module, in newer versions
    var VuetifyPlugin = _.get(Vuetify, 'default', Vuetify);
    Vue.use(VuetifyPlugin);
    // HACK: vue components end up under wrong name
    var vueitfyComponents = {
      'v-sidebar': 'VSidebar'
    };
    _.each(_.toPairs(vueitfyComponents), (pair) => {
      var [key, val] = pair;
      Vue.component(key, Vue.options.components[val]);
    });

    Vue.component('v-marker', Vue2Leaflet.Marker);
    Vue.component('v-poly', Vue2Leaflet.Polyline);
    Vue.component('v-group', Vue2Leaflet.LayerGroup);
    Vue.component('v-map', Vue2Leaflet.Map);
    Vue.component('v-color-picker', VueColor.Chrome);
    // Vue.component('hue', VueColor.Hue);
    Vue.component('v-tilelayer', Vue2Leaflet.TileLayer);
    $('#template-container')
      .load(
        'templates/templates.html',
        function() {
          // Vue application
          app = new Vue({
            el: '#app',
            mounted: function() {
              this.$nextTick(function() {
              });
            },
            data: function() {
              var params = urlParams();
              var defaults = {
                settings: {
                  sidebar: true,
                  story: false,
                  chart: true,
                  model: null,
                  repository: ''
                },
                colorToggleOptions: [
                  {
                    icon: 'colorize',
                    value: 'color'
                  },
                  {
                    icon: 'color_lens',
                    value: 'palette'
                  }
                ],
                colorType: 'color',
                color: defaultColor,
                palette: [],
                pipeline: null,
                model: null,
                sketch: null,
                sidebar: false
              };
              _.assign(defaults.settings, params);
              return defaults;
            },
            methods: {
              onColorChange(val) {
                this.color = val;
                this.sketch.palette = [val2rgbaString(val)];
              }
            },
            computed: {
              map: {
                get: function() {
                  return _.get(this.$refs, 'map.mapObject');
                },
                cache: false
              },
              zoom: {
                get: function() {
                  return _.get(this, 'model.view.zoom', 5);
                },
                cache: false
              },
              center: {
                get: function() {
                  // by default go to 0, 0
                  var center = [0, 0];
                  // if we have an extent look up the center
                  if (_.has(this, 'model.extent.sw')) {
                    var model = this.model;
                    var sw = L.latLng(model.extent.sw[0], model.extent.sw[1]),
                        ne = L.latLng(model.extent.ne[0], model.extent.ne[1]);
                    center = [
                      (sw.lat + ne.lat) / 2,
                      (sw.lng + ne.lng) / 2
                    ];
                  }
                  // use the model view center if available
                  center = _.get(this, 'model.view.center', center);
                  return center;
                },
                cache: false
              }
            }
          });

          bus.$on('model-selected', function(model) {
            // set the model in the app
            Vue.set(app, 'model', model);
            // this propagates to the components on the next tick
          });
          bus.$on('palette-selected', function(palette){
            Vue.set(app, 'palette', palette);
          });
          bus.$on('model-layer-added', function() {
          });
          bus.$on('sketch-created', function(sketch) {
            Vue.set(app, 'sketch', sketch);
          });
          bus.$on('pipeline-created', function(pipeline) {
            Vue.set(app, 'pipeline', pipeline);
          });
        });
  });




}());
