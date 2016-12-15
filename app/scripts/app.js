/* global Vue2Leaflet  */

// app is global, prefer to use this.$root
var app;
var bus;

(function () {
  'use strict';

  function urlParams () {
    // parse url parameters, adapted from http://stackoverflow.com/a/2880929/386327
    var match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); },
        query = window.location.search.substring(1);

    var result = {};
    while ((match = search.exec(query)) !== null) {
      // paraeter
      var value = decode(match[2]);
      var decoded = null;
      if (value === 'true') {
        decoded = true;
      } else if (value === 'false') {
        decoded = false;
      } else {
        decoded = value;
      }

      result[decode(match[1])] = decoded;
    }
    return result;

  }
  $(document).ready(function() {
    // make a global event bus
    bus = new Vue();
    Vue.component('v-map', Vue2Leaflet.Map);
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
                $('input[type="checkbox"]').bootstrapSwitch();
              });
            },
            data: function() {
              var params = urlParams();
              var defaults = {
                settings: {
                  sidebar: true,
                  story: false,
                  chart: false,
                  model: null
                },
                palette: [],
                pipeline: null,
                model: null,
                map: null,
                sketch: null
              };
              _.assign(defaults.settings, params);
              return defaults;
            },
            methods: {
            }
          });

          bus.$on('model-selected', function(model) {
            // set the model in the app
            Vue.set(app, 'model', model);
            // this propagates to the components on the next tick
            Vue.nextTick(() => {
              // we should have a model in the uv-source
              console.log('uv source', app.$refs.uvSource.model);
              // and in the mapcontainer

              var sw = L.latLng(model.extent.sw[0], model.extent.sw[1]),
                  ne = L.latLng(model.extent.ne[0], model.extent.ne[1]);
              var bounds = L.latLngBounds(sw, ne);
              if (_.has(app.$refs, 'map')) {
                console.info('fitting bounds', bounds, app.$refs.map);
                app.$refs.map.mapObject.flyToBounds(bounds);

              } else {
                console.warn('fitBounds missing', app.$refs, app, bounds);
              }

            });
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
