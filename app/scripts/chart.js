(function () {
  'use strict';

  Vue.component('chart-container', {
    template: '#chart-container-template',
    props: ['model'],
    data: function() {
      return {
        series: [],
        chart: null
      };
    },
    mounted: function(){
      this.createChart();
      // wait for other elements to load as well
      bus.$on('feature-selected', (feature) => {
        var url = 'http://127.0.0.1:5000/api/details/' + feature.properties.locationCode;
        fetch(url)
          .then((resp)=>{
            return resp.json();
          })
          .then((json) => {
            Vue.set(this, 'series', json.series);
          });
      });
      this.$nextTick(function(){
        this.updateChart();

      });
    },
    watch: {
      progress: function(newVal) {
        var data = [
          {x: newVal, y: 0},
          {x: newVal, y: 1.0}
        ];
        // this.chart.pathProgress
        //   .datum(data)
        //   .attr('d', this.chart.lineProgress);
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
      }
    },
    methods: {
      updateChart() {
        if (!this.model) {
          return;
        }

        var xDomain = _.map(this.model.extent.time, d3.isoParse);
        this.chart.xTime.domain(xDomain);
        this.chart.yWaterlevel.domain(this.model.extent.waterlevel);
        this.chart.xAxis
          .call(d3.axisBottom(this.chart.xTime));
        this.chart.yAxis
          .call(d3.axisLeft(this.chart.yWaterlevel));

        if (!this.series.length) {
          return;
        }

        // create the series
        var series = this.chart.g
              .selectAll('.series')
              .data(this.series)
              .enter()
              .append('g')
              .attr('class', 'series');


        var lineWaterlevel = d3.line()
              .x((d) => {
                var date = d3.isoParse(d.dateTime);
                var x = this.chart.xTime(date);
                return x;
              })
              .y((d) => {
                var y = this.chart.yWaterlevel(d.value/100.0);
                // cm/m
                return y;
              });

        series
          .append('path')
          .attr('class', 'line waterlevel')
          .attr('d', (d) => {
            return lineWaterlevel(d.data);
          })
          .style('stroke', (d) => {return d.color; });

      },
      updateChart2() {

        var station = stations[0];
        var data = station.data;
        xTime.domain(d3.extent(data, function(d) { return d3.isoParse(d.date); }));
        yWaterlevel.domain(d3.extent(data, function(d) { return d.s1; }));
        var lineWaterlevel = d3.line()
              .x(function(d) { return xTime(d3.isoParse(d.date)); })
              .y(function(d) { return yWaterlevel(d.s1); });
        g
          .datum(data)
          .append('path')
          .attr('class', 'line waterlevel')
          .attr('d', lineWaterlevel);



        var dataProgress = [
          {x: this.progress, y: 0},
          {x: this.progress, y: 1.0}
        ];
        var lineProgress = d3.line()
              .x(function(d) { return xLinear(d.x); })
              .y(function(d) { return y(d.y); });
        var pathProgress = g
              .datum(dataProgress)
              .append('path')
              .attr('class', 'line')
              .attr('d', lineProgress);
        this.chart = {
          pathProgress: pathProgress,
          lineProgress: lineProgress,
          xLinear: xLinear,
          xTime: xTime,
          y: y,
          svg: svg
        };

      },
      createChart() {
        var margin = {
          top: 14,
          right: 14 + 10,
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
        var svg = d3.select(this.$el)
              .append('svg');
        svg
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom);
        var g = svg
              .append('g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        var xAxis = g.append('g')
              .attr('class', 'axis axis--x')
              .attr('transform', 'translate(0,' + height + ')');
        var yAxis = g.append('g')
              .attr('class', 'axis axis--y');
        yAxis
          .append('text')
          .attr('class', 'axis-title')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text('waterlevel [cm]');



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
          yAxis: yAxis
        };
        Vue.set(this, 'chart', chart);
      }
    }
  });

}());
