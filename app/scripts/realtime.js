/* global bus */
(function () {
  'use strict';
  var StationIcon = Vue.component('station-icon', {
    template: '#station-icon-template',
    props: {
      feature: {
        type: Object
      }
    },
    data: function() {
      return {
      };
    }
  });

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
    components: {
      'station-icon': StationIcon
    },
    mounted: function() {
      var url = 'data/points';
      fetch(url)
        .then((resp) => {
          return resp.json();
        })
        .then((json) => {
          _.each(json.features, (feature) => {
            feature.properties.selected = false;
          });
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

        var markers = L.markerClusterGroup({
          iconCreateFunction: function(cluster) {
            var id = 'cluster-' + cluster._leaflet_id;

            var marker = L.divIcon({ html: '<div class="cluster-icon" id="' + id + '"></div>' });
            cluster.on('add', function(evt) {
              var markers = cluster.getAllChildMarkers();
              var colors = _.map(markers, 'options.feature.properties.locationColor');
              var data = _.toPairs(_.groupBy(colors));
              var pie = d3.pie()
                .value(function(d) {
                  return d[1].length;
                });
              var width = 20;
              var height = 20;
              var radius = Math.min(width, height) / 2;
              var arc = d3.arc()
                  .outerRadius(radius)
                  .innerRadius(0);
              var svg = d3.select('#' + id).append('svg')
                  .attr('width', width)
                  .attr('height', height)
                  .append('g')
                  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
              var g = svg.selectAll('.arc')
                  .data(pie(data))
                  .enter()
                  .append('g')
                  .attr('class', 'arc');

              g.append('path')
                .attr('d', arc)
                .style('fill', function(d) {
                  return d.data[0];
                });

            });
            return marker;
          }
        });
        _.each(this.points.features, (feature, i) => {
          var latlng = L.latLng(feature.properties.lat, feature.properties.lon);

          // html: '<div id="station-icon-"' + feature.id + '></div>',
          var id = 'station-icon-' + feature.id;
          var icon = L.divIcon({
            html: '<station-icon :feature="points.features[' + i + ']" id="' + id + '"></station-icon>',
            iconSize: L.point(20, 20)
          });
          var marker = L.marker(latlng, {
            icon: icon,
            feature: feature
          });

          marker.on('click', (evt) => {
            this.setChart(feature, evt);

          });
          marker.on('add', (evt) => {
            // dynamicly mount the icon
            var element = $(marker.getElement()).find('station-icon');
            (new StationIcon({
              parent: this,
              propsData: {
                feature: feature
              }
            })).$mount(element[0]);

          });

          markers.addLayer(marker);


        });

        // select first feature
        this.layerGroup.addLayer(markers);
        var selectedFeature = _.first(
          _.filter(
            this.points.features,
            (feature) => {
              return feature.properties.featured;
            }
          )
        );
        this.setChart(selectedFeature);
      },
      clearMarkers() {
        if (this.layerGroup) {
          this.layerGroup.clearLayers();
        }
      },
      setChart(feature, evt) {
        _.each(
          this.points.features,
          (feature) => {
            feature.properties.selected = false;
          }
        );
        feature.properties.selected = true;
        bus.$emit('feature-selected', feature);
      }
    }
  });

}());
