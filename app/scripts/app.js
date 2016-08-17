var app;
(function () {

  // Vue application
  app = new Vue({
    el: '#app',
    ready: function() {
    },
    data: function() {
      return {
        settings: {
        },
        palette: [],
        model: null,
        map: null,
        sketch: null
      };
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
  bus.$on('model-layer-added', function(obj){
  });
  bus.$on('sketch-created', function(sketch){
    app.$set('sketch', sketch);
  });
  bus.$on('map-created', function(map){
    app.$set('map', map);
  });

  Vue.config.debug = true;



}());
