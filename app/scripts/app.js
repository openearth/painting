(function () {

  // Vue application
  new Vue({
    el: '#app',
    data: {
    },
    events: {
      'model-selected': function(model) {
        console.log('app detected model selected', model);
      }
    }
  })
  Vue.config.debug = true;



}());
