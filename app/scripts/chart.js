/* global bus */
(function () {
  'use strict';

  Vue.component('chart-container', {
    template: '#chart-container-template',
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
        series: [],
        limits: [],
        feature: null,
        chart: null
      };
    },
    mounted: function(){
      this.createChart();
      // wait for other elements to load as well
      bus.$on('feature-selected', (feature) => {
        this.feature = feature;

        if (_.has(feature, 'properties.series')) {
          // data is in the feature
          Vue.set(this, 'series', [feature.properties.series]);
        } else {
          // get the url
          let url = this.realtime.details;

          let location = _.get(feature, 'properties.locationCode', feature.id);

          // we have a template url
          if (_.includes(url, '${location}')) {
            // fill in template
            url = _.template(url)({location: location});
          }

          // we have a repository
          if (this.repository !== '') {
            if (!url.startsWith('http')) {
              url = urljoin(this.repository, url);
            }

          }

          fetch(url)
            .then((resp)=>{
              return resp.json();
            })
            .then((json) => {
              Vue.set(this, 'series', json.series);
              // limits
              Vue.set(this, 'limits', _.get(json, 'limits', []));
            });

        }
      });
      this.$nextTick(function(){


        window.addEventListener('resize', () => {
          this.createChart();
          this.updateChart();
        });
        this.updateChart();

      });
    },
    watch: {
      progress: function(newVal) {
        if (_.isNaN(newVal)) {
          return;
        }
        var data = [
          {x: newVal, y: 0},
          {x: newVal, y: 1.0}
        ];
        this.chart.pathProgress
          .datum(data)
          .transition()
          .attr('d', this.chart.lineProgress);
      },
      series: function() {
        this.updateChart();
      },
      model: function() {
        this.updateChart();
      }
    },
    computed: {
      progress: {
        cache: false,
        get: function() {
          if (!_.has(this.model, 'currentTime')) {
            return 0.0;
          }
          var progress = this.model.currentTime / this.model.duration;
          return progress;
        }
      },
      name: {
        cache: false,
        get: function() {
          return _.get(this.feature, 'properties.name');
        }
      }
    },
    methods: {
      updateChart() {
        if (!this.model) {
          return;
        }

        var xDomain = [moment().subtract(1, 'days').toDate(), moment().toDate()];
        if (_.has(this.model.extent, 'time')) {
          xDomain = _.map(this.model.extent.time, d3.isoParse);
        } else {
          var dates = _.map(
            _.flatMap(
              _.flatMap(this.series, 'data'),
              'dateTime'
            ),
            d3.isoParse
          );
          xDomain = d3.extent(dates);
        }
        this.chart.xTime.domain(xDomain);

        var values = _.flatMap(_.flatMap(this.series, 'data'), 'value');
        var valuesExtent = d3.extent(values);
        var yDomain = _.get(
          this.model.extent,
          'waterlevel',
          valuesExtent
        );

        this.chart.yWaterlevel.domain(yDomain);
        this.chart.xAxis
          .transition()
          .call(d3.axisBottom(this.chart.xTime));
        this.chart.yAxis
          .transition()
          .call(
            d3.axisLeft(this.chart.yWaterlevel)
              .ticks(5)
          );


        if (!this.series.length) {
          return;
        }
        // remove old series
        this.chart.g
          .selectAll('.series')
          .remove();
        this.chart.g
          .selectAll('.limits')
          .remove();
        this.chart.g
          .selectAll('.limits')
          .data(this.limits)
          .enter()
          .append('rect')
          .attr('class', 'limits clipped')
          .attr('x', () => {
            var t0 = xDomain[0];
            return this.chart.xTime(t0);
          })
          .attr('y', (d) => {
            var y = yDomain[1];
            if (!_.isNil(d.to)) {
              y = d.to;
            }
            return this.chart.yWaterlevel(y);
          })
          .attr('width', () => {
            var t1 = xDomain[1];
            var t0 = xDomain[0];
            var width = this.chart.xTime(t1) - this.chart.xTime(t0);
            return width;
          })
          .attr('height', (d) => {
            var y0 = yDomain[0];
            if (!_.isNil(d.from)) {
              y0 = d.from;
            }
            var y1 = yDomain[1];
            if (!_.isNil(d.to)) {
              y1 = d.to;
            }
            var height = this.chart.yWaterlevel(y0) - this.chart.yWaterlevel(y1);
            if (height < 0) {
              return 0;
            }
            return height;
          })
          .style('fill', (d) => {
            return d.color;
          })
          .style('opacity', 0.2);

        // create the series
        var series = this.chart.g
            .selectAll('.series')
            .data(this.series)
            .enter()
            .append('g')
            .attr('class', 'series');


        var lineWaterlevel = d3.line()
            .x((d) => {
              var date = d3.isoParse(d.date || d.dateTime);
              var x = this.chart.xTime(date);
              return x;
            })
            .y((d) => {
              var y = this.chart.yWaterlevel(d.s1 || d.value);
              // cm/m
              return y;
            });

        series
          .append('path')
          .attr('class', 'line waterlevel clipped')
          .attr('d', (d) => {
            return lineWaterlevel(_.get(d, 'data', d));
          })
          .style('stroke', (d) => {return d.color; });



      },
      createChart() {
        var margin = {
          top: 14,
          right: 14,
          bottom: 14 + 14,
          left: 14 + 20
        };
        var width = this.$el.clientWidth - margin.left - margin.right;
        var height = this.$el.clientHeight - margin.top - margin.bottom;

        var xTime = d3.scaleTime()
          .range([0, width]);
        var xLinear = d3.scaleLinear()
          .range([0, width]);
        var yLinear = d3.scaleLinear()
          .range([height, 0]);
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
        var xAxis = g.append('g')
          .attr('class', 'axis axis--x')
          .attr('transform', 'translate(0,' + height + ')');
        var yAxis = g.append('g')
          .attr('class', 'axis axis--y');
        yAxis
          .append('text')
          .attr('class', 'axis-title')
          .attr('transform', 'rotate(-90)')
          .attr('y', -margin.left)
          .attr('dy', '1em')
          .attr('x', -height / 2.0)
          .style('text-anchor', 'middle')
          .text('water hoogte [m]');


        var dataProgress = [
          {x: this.progress, y: 0},
          {x: this.progress, y: 1.0}
        ];
        var lineProgress = d3.line()
          .x(function(d) { return xLinear(d.x); })
          .y(function(d) { return yLinear(d.y); });
        var pathProgress = g
          .datum(dataProgress)
          .append('path')
          .attr('class', 'line')
          .attr('d', lineProgress);
        var chart = {
          svg: svg,
          g: g,
          xTime: xTime,
          xLinear: xLinear,
          yWaterlevel: yWaterlevel,
          yLinear: yLinear,
          width: width,
          height: height,
          xAxis: xAxis,
          yAxis: yAxis,
          lineProgress: lineProgress,
          pathProgress: pathProgress
        };
        Vue.set(this, 'chart', chart);
      }
    }
  });

}());
