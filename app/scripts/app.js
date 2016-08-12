(function () {

  // Vue application
  var app = new Vue({
    el: '#app',
    ready: function() {
    },
    data: function() {
      return {
        palette: []
      };
    }
  });
  bus.$on('palette-selected', function(palette){
    app.$set('palette', palette);
  });

  Vue.config.debug = true;



}());
