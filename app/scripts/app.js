/* global bus  */

// app is global, prefer to use this.$root
var app;
(function () {
  'use strict';
  // Vue application
  app = new Vue({
    el: '#app',
    ready: function() {
      this.$nextTick(function() {
        $('input[type="checkbox"]').bootstrapSwitch();
      });
    },
    data: function() {
      return {
        settings: {
        },
        palette: [],
        pipeline: {},
        model: null,
        map: null,
        sketch: null
      };
    },
    methods: {
    }
  });

  bus.$on('model-selected', function(model){
    // set the model in the app
    app.$set('model', model);
    // this propagates to the components on the next tick
    Vue.nextTick(function() {
      // we should have a model in the uv-source
      console.log('uv source', app.$refs.uvSource.model);
      // and in the mapcontainer
      app.$refs.mapContainer.loadModel(model);
    });
  });
  bus.$on('palette-selected', function(palette){
    app.$set('palette', palette);
  });
  bus.$on('model-layer-added', function() {
  });
  bus.$on('sketch-created', function(sketch) {
    app.$set('sketch', sketch);
  });
  bus.$on('pipeline-created', function(pipeline) {
    app.$set('pipeline', pipeline);
  });

  Vue.config.debug = true;



}());
