/* global bus */
(function () {

  'use strict';
  Vue.component('model-details', {
    template: '#model-details-template',
    props: ['model'],
    data: function() {
      return {};
    },
    methods: {
      select() {
        console.log('selecting', this.model);
        // dispatch to parent
        bus.$emit('model-selected', this.model);
      }
    }
  });

  Vue.component('models-overview', {
    template: '#models-overview-template',
    props: {
      repository: {
        type: String,
        default: ''
      }
    },
    data: function() {
      return {
        models: []
      };
    },
    mounted: function() {
      // get models.json
      var path = this.repository === '' ? 'data/models.json' : 'models';
      fetch(urljoin(this.repository, path))
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          this.models = _.get(json, 'models', json);

          // find the model by url parameter
          var selectedModel = _.first(_.filter(this.models, ['id', this.$root.settings.model]));
          if (_.isNil(selectedModel)) {
            // select first model
            selectedModel = _.first(this.models);
          }
          this.selectModel(selectedModel);
        })
        .catch(function(ex) {
          console.warn('parsing failed', ex);
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
        bus.$emit('model-selected', model);

      }
    }

  });

}());
