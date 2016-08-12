(function () {

  'use strict';

  Vue.component('model-overview', {
    template: '#model-overview-template',
    data: function() {
      return {
        models: []
      };
    },
    ready: function() {
      // get models.json
      fetch('data/models.json')
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          this.models = json.models;
          // select first model
          document.dispatchEvent(
            new CustomEvent(
              'model-selected',
              {'detail': json.models[0]}
            )
          );
        })
        .catch(function(ex) {
          console.log('parsing failed', ex);
        });

    },
    methods: {
      selectModel: function(model) {
        // find the model and add a click event to the cog link
        var event = new CustomEvent(
          'model-selected',
          {'detail': model}
        );
        document.dispatchEvent(event);
        // dispatch to parent
        this.$dispatch('model-selected', model);

      }
    }

  });

}());
