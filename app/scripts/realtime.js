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
        limits: null,
        series: null
      };
    },
    methods: {
      createChart: function() {
        var model = this.$root.model;
        var margin = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        };
        var width = this.$el.clientWidth - margin.left - margin.right;
        var height = this.$el.clientHeight - margin.top - margin.bottom;

        var xTime = d3.scaleTime()
          .range([0, width]);
        var yWaterlevel = d3.scaleLinear()
            .range([height, 0]);
        var el = $(this.$el).find('svg')[0];

        var svg = d3.select(el);
        svg.selectAll('*').remove();

        svg
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom);
        var g = svg
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        g
          .append('clipPath')
          .attr('id', 'clip')
          .append('rect')
          .attr('width', width)
          .attr('height', height);

        var xDomain = _.map(model.extent.time, d3.isoParse);
        xTime.domain(xDomain);
        yWaterlevel.domain(model.extent.waterlevel);


        if (!this.series.length) {
          return;
        }
        // remove old series
        g
          .selectAll('.series')
          .remove();

        // create the series
        var series = g
            .selectAll('.series')
            .data(this.series)
            .enter()
            .append('g')
            .attr('class', 'series');


        var lineWaterlevel = d3.line()
            .x((d) => {
              var date = d3.isoParse(d.dateTime);
              var x = xTime(date);
              return x;
            })
          .y((d) => {
            var y = yWaterlevel(d.value / 100.0);
            // cm/m
            return y;
          });

        series
          .append('path')
          .attr('class', 'line waterlevel clipped')
          .attr('d', (d) => {
            return lineWaterlevel(d.data);
          });

      }
    },
    mounted: function() {
      var feature = this.feature;
      var url = 'data/details/' + feature.properties.locationCode;
      fetch(url)
        .then((resp)=>{
          return resp.json();
        })
        .then((json) => {
          Vue.set(this, 'series', json.series);
          // limits
          Vue.set(this, 'limits', _.get(json, 'limits', []));
          this.createChart();
        });

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

        var markerGroup = L.markerClusterGroup({
          iconCreateFunction: function(cluster) {
            /* eslint-disable no-underscore-dangle */
            var id = 'cluster-' + cluster._leaflet_id;
            /* eslint-enable no-underscore-dangle */

            var marker = L.divIcon({ html: '<div class="cluster-icon" id="' + id + '"></div>' });
            cluster.on('add', function() {
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
          marker.on('add', () => {
            // dynamicly mount the icon
            var element = $(marker.getElement()).find('station-icon');
            (new StationIcon({
              parent: this,
              propsData: {
                feature: feature
              }
            })).$mount(element[0]);

          });

          markerGroup.addLayer(marker);


        });

        // select first feature
        this.layerGroup.addLayer(markerGroup);
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
      setChart(feature) {
        _.each(
          this.points.features,
          (obj) => {
            obj.properties.selected = false;
          }
        );
        feature.properties.selected = true;
        bus.$emit('feature-selected', feature);
      }
    }
  });

}());
