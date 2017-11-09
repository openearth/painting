/* global Vuetify, mockupModel  */

var bus;
var app;

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
          bus.$emit('app-loaded', app);

        });
  });
}());
