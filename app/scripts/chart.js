(function () {
  'use strict';

  Vue.component('chart-container', {
    template: '#chart-container-template',
    props: ['model'],
    data: function() {
      return {
        url: 'data/stories/data/denhelder.json',
        chart: null
      };
    },
    ready: function(){
      console.log('create chart in ', this.$el);
      // wait for other elements to load as well
      this.$nextTick(function(){
        var margin = {
          top: 10,
          right: 10,
          bottom: 20,
          left: 10
        };
        var width = this.$el.clientWidth - margin.left - margin.right;
        var height = this.$el.clientHeight - margin.top - margin.bottom;

        var xTime = d3.scaleTime()
              .range([0, width]);
        var xLinear = d3.scaleLinear()
              .range([0, width]);
        var y = d3.scaleLinear()
              .range([height, 0]);
        var yWaterlevel = d3.scaleLinear()
              .range([height, 0]);
        var svg = d3.select(this.$el)
              .append('svg');
        svg
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // add tide data
        d3.json(this.url, function(data){
          console.log('got data', data.length);
          xTime.domain(d3.extent(data, function(d) { return d3.isoParse(d.date); }));
          yWaterlevel.domain(d3.extent(data, function(d) { return d.h; }));
          var lineWaterlevel = d3.line()
                .x(function(d) { return xTime(d3.isoParse(d.date)); })
                .y(function(d) { return yWaterlevel(d.h); });
          svg
            .datum(data)
            .append('path')
            .attr('class', 'line waterlevel')
            .attr('d', lineWaterlevel);

          svg.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(xTime));

          svg.append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(yWaterlevel))
            .append('text')
            .attr('class', 'axis-title')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end');

        });

        var dataProgress = [
          {x: this.progress, y: 0},
          {x: this.progress, y: 1.0}
        ];
        var lineProgress = d3.line()
              .x(function(d) { return xLinear(d.x); })
              .y(function(d) { return y(d.y); });
        var pathProgress = svg
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

      });
    },
    watch: {
      progress: function(newVal) {
        var data = [
          {x: newVal, y: 0},
          {x: newVal, y: 1.0}
        ];
        this.chart.pathProgress
          .datum(data)
          .attr('d', this.chart.lineProgress);
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
    }
  });

}());
