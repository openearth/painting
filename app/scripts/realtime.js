/* global bus */
(function () {
  'use strict';
  Vue.component('realtime-layer', {
    template: '#realtime-layer-template',
    props: {
      model: {
        type: Object
      }
    },
    data: function() {
      return {
        points: [],
        layerGroup: null
      };
    },
    watch: {
      points: function() {
        this.clearMarkers();
        this.createMarkers();
      }
    },
    mounted: function() {
      var url = 'data/points';
      fetch(url)
        .then((resp) => {
          return resp.json();
        })
        .then((json) => {
          Vue.set(this, 'points', json);
        });

    },
    computed: {
    },
    methods: {
      deferredMountedTo(parent) {
        this.layerGroup = L.layerGroup([]);
        this.layerGroup.addTo(parent);
      },
      createMarkers() {

        _.each(this.points.features, (feature) => {
          var latlng = L.latLng(feature.properties.lat, feature.properties.lon);
          var radius = feature.properties.featured ? 3000 : 1000;
          var circle = L.circle(latlng, {
            radius: radius,
            color: 'white',
            stroke: true,
            weight: 1,
            opacity: 0.3,
            fillOpacity: 0.5,
            fill: true,
            fillColor: feature.properties.locationColor,
            feature: feature
          });
          circle.on('click', (evt) => {
            this.setChart(evt.target.options.feature);
          });
          this.layerGroup.addLayer(circle);

        });
        var selectedFeature = _.first(_.filter(this.points.features, (feature) => {return feature.properties.featured;} ));
        this.setChart(selectedFeature);
      },
      clearMarkers() {
        if (this.layerGroup) {
          this.layerGroup.clearLayers();
        }
      },
      setChart(feature) {
        bus.$emit('feature-selected', feature);
      }
    }
  });

}());
