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
        models: []
      };
    },
    mounted: function() {
      // get models.json
      var url = 'data/models.json';
      if (this.repository !== '') {
        // TODO: use absolute links
        if (!this.repository.endsWith('models')) {
          url = urljoin(this.repository, 'models.json');
        } else {
          url = this.repository;
        }

      }
      fetch(url, {mode: 'cors'})
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
        let url = 'gear';
        if (_.has(model, 'metadata.icon')) {
          url = model.metadata.icon;
          if (this.repository) {
            url = urljoin(this.repository, url);
          }
        } else if (_.has(model, 'extent.ne')) {
          let lat = ((model.extent.ne[0] + model.extent.sw[0])/2).toFixed(3);
          let lon = ((model.extent.ne[1] + model.extent.sw[1])/2).toFixed(3);
          let zoom = _.get(model, 'view.zoom', 10).toFixed(0);
          let urlTemplate = _.template('images/icons/${lat}_${lon}_${zoom}.jpg');
          url = urlTemplate({
            lat: lat,
            lon: lon,
            zoom: zoom
          });

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
