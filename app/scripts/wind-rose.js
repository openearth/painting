/* global */
(function () {
  'use strict';

  Vue.component('wind-rose', {
    template: '#wind-rose-template',
    props: {
      model: {
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
        path: null,
        line: null
      };
    },
    watch: {
      'model.realtime.wind': function() {
        this.updateWindSeries();
      },
      'model.currentTime': function(time) {

        if (!this.series.length) {
          // no data yet...
          return;
        }

        var date0 = moment(this.model.extent.time[0]);
        var date1 = moment(this.model.extent.time[1]);
        // miliseconds
        var dateDiff = date1 - date0;
        var relativeDuration = time / _.get(this.model, 'duration', 1);
        var currentDate = date0 + (relativeDuration * dateDiff);
        var bisect = d3.bisector(function(d) { return d.date; }).left;
        // in case bisect is longer than timeries clamp it
        var rowIndex = _.clamp(bisect(this.series, currentDate), 0, this.series.length - 1);

        var row = this.series[rowIndex];
        this.arrow
          .datum([{u: 0, v: 0}, row])
          .transition()
          .attr('d', this.line);

      },
      series: function(series) {
        this.path
          .datum(series)
          .attr('class', 'line')
          .attr('d', this.line);
      }
    },
    mounted: function(){
      if (!_.isNil(this.model) && _.has(this.model, 'realtime.wind')) {
        this.updateWindSeries();
      }
      this.updateAxis();
    },
    methods: {
      updateAxis() {
        var svgElement = this.$el.querySelector('.wind-rose');
        var svg = d3.select(svgElement);
        var width = 246;
        var height = 246;

        // Based on: https://bl.ocks.org/mbostock/4583749
        var radius = Math.min(width, height) / 2 - 30;


        var rScale = d3.scaleLinear()
            .domain([0, 10.0])
            .range([0, radius]);
        var line = d3.radialLine()
            .radius(function(d) {
              var r = Math.sqrt(Math.pow(d.u, 2) + Math.pow(d.v, 2));
              return rScale(r);
            })
            .angle(function(d) {
              var angle = Math.atan2(d.v, d.u);
              return angle;
            });
        this.line = line;


        svg
          .attr('width', width)
          .attr('height', height);

        var g = svg
          .append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        var gr = g.append('g')
          .attr('class', 'r axis')
          .selectAll('g')
            .data(
              rScale
                .ticks(5)
                .slice(1)
            )
            .enter()
            .append('g');
        gr.append('circle')
          .attr('r', rScale);

        gr.append('text')
          .attr('y', function(d) { return -rScale(d) - 4; })
          .attr('transform', 'rotate(15)')
          .style('text-anchor', 'middle')
          .text(function(d) {
            return d.toFixed(0);
          });


        var ga = g.append('g')
            .attr('class', 'a axis')
            .selectAll('g')
            .data(d3.range(0, 360, 30))
            .enter()
            .append('g')
            .attr('transform', function(d) { return 'rotate(' + -d + ')'; });

        ga.append('line')
          .attr('x2', radius);


        ga.append('text')
          .attr('x', radius + 6)
          .attr('dy', '.35em')
          .style('text-anchor', function(d) { return d < 270 && d > 90 ? 'end' : null; })
          .attr('transform', function(d) { return d < 270 && d > 90 ? 'rotate(180 ' + (radius + 6) + ',0)' : null; })
          .text(function(d) { return d + '°'; });


        var path = g.append('path')
            .datum(this.series)
            .attr('class', 'line')
            .attr('d', line);
        this.path = path;

        var arrow = g
            .append('path')
            .attr('class', 'arrow');
        this.arrow = arrow;
      },
      updateWindSeries() {
        var url = this.model.realtime.wind;
        if (this.repository !== '') {
          url = urljoin(this.repository, this.model.realtime.wind);
        }
        fetch(url)
          .then((resp) => {
            return resp.json();
          })
          .then((json) => {
            _.each(json, (row) => {
              row.date = moment.utc(row.t);
            });
            Vue.set(this, 'series', json);
          });
      }
    }
  });
})();
