/* global Vue2Leaflet, Vuetify, urlParams, val2rgbaString  */
// app is global, prefer to use this.$root
var app;
var bus;

(function () {
  'use strict';
  $(document).ready(function() {
    // make a global event bus
    bus = new Vue();
    // HACK: Vuetify is exposed as a module, in newer versions
    var VuetifyPlugin = _.get(Vuetify, 'default', Vuetify);
    Vue.use(VuetifyPlugin);
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
              return {
                mockupModel: mockupModel,
                series: []
              };
            },
            methods: {
            },
            computed: {
            }
          });

        });
  });




}());
