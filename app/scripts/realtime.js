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
    },
    methods: {

    },
    mounted: function() {

    }
  });

  Vue.component('realtime-details', {
    template: '#realtime-details-template',
    props: {
      realtime: {
        type: Object
      }
    },
    methods: {
      select() {
        console.log('selecting', this.realtime);
        // dispatch to parent
        bus.$emit('realtime-selected', this.realtime);
      },
      deselect() {
        console.log('selecting', null);
        // dispatch to parent
        bus.$emit('realtime-selected', null);
      }

    }

  });

  Vue.component('realtime-overview', {
    template: '#realtime-overview-template',
    data: function() {
      return {
        realtime: []
      };
    },
    mounted() {
      const url = 'data/realtime.json';
      fetch(url)
        .then((resp) => {
          return resp.json();
        })
        .then((json) => {
          let realtime = json.realtime;
          _.each(realtime, (el) => {
            el.loaded = false;
          });
          this.realtime = json.realtime;

        });
    }
  });

  Vue.component('realtime-layer', {
    template: '#realtime-layer-template',
    props: {
      model: {
        type: Object
      },
      realtime: {
        type: Object
      },
      repository: {
        type: String,
        default: ''
      }
    },
    data: function() {
      return {
        points: [],
        markerGroup: null,
        layerGroup: null
      };
    },
    watch: {
      points() {
        this.clearMarkers();
        this.createMarkers();
      },
      realtime() {
        this.fetchPoints();
      }
    },
    components: {
      'station-icon': StationIcon
    },
    mounted() {
      this.fetchPoints();
    },
    computed: {
    },
    methods: {
      fetchPoints() {

        if (_.isNil(this.realtime)) {
          // no realtime data yet, wait for watch
          this.clearMarkers();
          return;
        }

        let url = this.realtime.points;

        // we have a repository
        if (this.repository !== '') {
          url = urljoin(this.repository, url);
        }

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
      deferredMountedTo(parent) {
        this.layerGroup = L.layerGroup([]);
        this.layerGroup.addTo(parent);
        if (this.markerGroup) {
          this.layerGroup.addLayer(this.markerGroup);
        }

      },
      createMarkers() {

        var markerGroup = L.markerClusterGroup({
          iconCreateFunction: function(cluster) {
            /* eslint-disable no-underscore-dangle */
            var id = 'cluster-' + cluster._leaflet_id;
            /* eslint-enable no-underscore-dangle */

            var markerIcon = L.divIcon({ html: '<div class="cluster-icon" id="' + id + '"></div>' });
            cluster.on('add', function() {
              var markers = cluster.getAllChildMarkers();
              var colors = _.map(
                markers, (marker) => {
                  return _.get(marker, 'options.feature.properties.locationColor', '#eebb33');
                }
              );
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
            return markerIcon;
          }
        });
        _.each(this.points.features, (feature, i) => {
          var lat = _.get(feature, 'properties.lat', feature.geometry.coordinates[1]);
          var lon = _.get(feature, 'properties.lon', feature.geometry.coordinates[0]);
          var latlng = L.latLng(lat, lon);

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
            var station = new StationIcon({
              parent: this,
              propsData: {
                feature: feature
              }
            });
            // this.$children.push(station);
            station.$mount(element[0]);

          });

          markerGroup.addLayer(marker);


        });

        // select first feature
        this.markerGroup = markerGroup;
        var selectedFeature = _.first(
          _.filter(
            this.points.features,
            (feature) => {
              // features can be featured (...), by default they are
              return _.get(feature, 'properties.featured', true);
            }
          )
        );
        this.setChart(selectedFeature);

        if (!_.isNil(this.layerGroup)) {
          this.layerGroup.addLayer(markerGroup);
        }
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
