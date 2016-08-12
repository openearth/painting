(function () {

  // Vue application
  new Vue({
    el: '#app',
    data: {
    },
    events: {
      'model-selected': function(model) {
        console.log('app detected model selected', model);
      },
      'palette-selected': function(palette) {
        console.log('app detected palette selected', palette);
      }
    }
  })
  Vue.config.debug = true;



}());
