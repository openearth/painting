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
      },
      formatStartTime() {
        let a = moment(this.model.extent.time[0]);
        return a.calendar();
      },
      formatDuration() {
        let a = moment(this.model.extent.time[0]);
        let b = moment(this.model.extent.time[1]);
        let duration = moment.duration(b.diff(a));
        return duration.humanize();

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
        models: [],
        icons: {
          default: 'http://www.openearth.nl/painting/images/icons/deltares.png'
        }
      };
    },
    mounted: function() {

      // get model icons
      var iconUrl = 'data/icons.json';
      fetch(iconUrl, {mode: 'cors'})
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          // lookup icons
          this.icons = json;
        });

      // get models.json
      var modelsUrl = 'data/models.json';
      if (this.repository !== '') {
        // TODO: use absolute links
        if (!this.repository.endsWith('models')) {
          modelsUrl = urljoin(this.repository, 'models.json');
        } else {
          modelsUrl = this.repository;
        }

      }
      fetch(modelsUrl, {mode: 'cors'})
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

      },
      formatStartTime(model) {
        let a = moment(model.extent.time[0]);
        return a.calendar();
      },
      formatDuration(model) {
        let a = moment(model.extent.time[0]);
        let b = moment(model.extent.time[1]);
        let duration = moment.duration(b.diff(a));
        return duration.humanize();
      },
      lookupIcon(model) {
        // icon is icons/lat_lon_zoom.jpg
        // default icon
        let url = this.icons.default;
        if (_.has(model, 'metadata.icon')) {
          url = model.metadata.icon;
          if (this.repository) {
            url = urljoin(this.repository, url);
          }
        } else {
          if (_.has(this.icons, model.metadata.title)) {
            url = this.icons[model.metadata.title];
          }
          if (_.has(this.icons, model.id)) {
            url = this.icons[model.id];
          }
        }
        return url;

      },
      nestedModels() {
        let sortedModels = _.reverse(
          _.sortBy(
            this.models,
            (model) => model.extent.time[0]
          )
        );
        let groupedModels = _.groupBy(
          sortedModels,
          (model) => {
            return _.get(model, 'metadata.title', model.title);
          }
        );
        let grouped = _.map(groupedModels, function(value, index) {
          return {
            title: index,
            items: value,
            metadata: value[0].metadata,
            active: false,
            icon: 'folder'
          };
        });
        return grouped;
      }
    }

  });

}());
