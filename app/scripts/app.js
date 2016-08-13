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
    app.$set('model', model);
  });
  bus.$on('palette-selected', function(palette){
    app.$set('palette', palette);
  });
  bus.$on('sketch-created', function(sketch){
    app.$set('sketch', sketch);
  });
  bus.$on('map-created', function(map){
    app.$set('map', map);
  });

  Vue.config.debug = true;



}());
