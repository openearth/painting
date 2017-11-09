/* global */
(function () {
  'use strict';

  Vue.component('wind-rose', {
    template: '#wind-rose-template',
    props: {
      model: {
        type: Object
      },
      currentPoint: {
        type: Object
      },
      // u and v timeseries (begin and end time will be filled in from model extent)
      url: {
        type: String,
        default: 'http://stathakis-dev.eu-west-1.elasticbeanstalk.com/stathakis/1.0.0/grids/ncep/measurements/wind?lat=${lat}&lon=${lon}&start_time=${startTime}&end_time=${endTime}'
      }
    },
    data: function() {
      return {
        // timeseries with dateTime (iso), u, v
        series: [],
        arrow: null,
        path: null,
        svg: null,
        loading: false
      };
    },
    watch: {
      'model.currentTime': function(time) {
        if (!this.series.length) {
          // no data yet...
          return;
        }

        let startDate = moment(this.model.extent.time[0]);
        let endDate = moment(this.model.extent.time[1]);
        // miliseconds
        let dateDiff = endDate - startDate;
        let relativeDuration = time / _.get(this.model, 'duration', 1);
        let currentDate = startDate + (relativeDuration * dateDiff);
        let bisect = d3.bisector(function(d) { return d.date; }).left;
        // in case bisect is longer than timeries clamp it
        let rowIndex = _.clamp(bisect(this.series, currentDate), 0, this.series.length - 1);
        let row = this.series[rowIndex];
        this.arrow
          .datum([{u: 0, v: 0}, row])
          .transition()
          .attr('d', this.line);
        let selection = _.slice(this.series, 0, rowIndex + 1);
        this.path
          .datum(
            selection
          )
          .transition()
          .duration(500)
          .attr('d', this.line);


      },
      currentPoint: function(pt) {
        this.updateWindSeries();
      },
      series: function(series) {
        this.updateAxis();
      }
    },
    mounted: function(){
      let svgElement = this.$el.querySelector('.wind-rose');
      let svg = d3.select(svgElement);
      this.svg = svg;
      if (!_.isNil(this.model) && this.url) {
        this.updateWindSeries();
      }
      this.updateAxis();
    },
    computed: {
      lat: {
        get() {
          return this.currentPoint.lat;
        },
        cache: false
      },
      lon: {
        get() {
          return this.currentPoint.lng;
        },
        cache: false
      },
      displayLatLng: {
        get() {
          {
            let template = _.template('${lat}&deg;N, ${lon}&deg;E');
            return template({
              lat: this.lat.toFixed(3),
              lon: this.lon.toFixed(3)
            });
          }
        },
        cache: false
      }
    },
    methods: {
      selectPoint() {
        bus.$emit('select-point');
      },
      updateAxis() {
        let svg = this.svg;

        // todo, replace by client height
        var width = 280;
        var height = 280;

        svg
          .attr('width', width)
          .attr('height', height);

        // Based on: https://bl.ocks.org/mbostock/4583749
        var radius = Math.min(width, height) / 2 - 48;
        var magMax = 10.0;
        if (this.series.length) {
          var mag = _.map(this.series, (d) => {
            return Math.sqrt(
              Math.pow(d.u, 2) + Math.pow(d.v, 2)
            );
          });
          magMax = _.max(mag);

        }

        var rScale = d3.scaleLinear()
            .domain([0, magMax])
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



        var g = svg
            .select('#chart')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        // remove old axis
        g.select('g.r.axis')
          .selectAll('*')
          .remove();
        var gr = g.select('g.r.axis')
            .selectAll('g')
            .data(
              rScale
                .ticks(3)
                .slice(1)
            )
            .enter()
            .append('g');

        // cleanup old circles
        gr.selectAll('circle').remove();
        gr.append('circle')
          .attr('r', rScale);

        // clean up old texts
        gr.selectAll('text').remove();
        gr.append('text')
          .attr('y', function(d) { return -rScale(d) - 4; })
          .attr('transform', 'rotate(15)')
          .style('text-anchor', 'middle')
          .text(function(d) {
            return d.toFixed(0);
          });


        var ga = g.select('g.a.axis')
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


        // start with empty path (let it draw)
        var path = g.select('path.line')
            .datum([])
            .attr('d', line);
        this.path = path;

        var arrow = g.select('path.arrow');
        this.arrow = arrow;
      },
      updateWindSeries() {
        this.loading = true;
        let startTime = moment(this.model.extent.time[0]).toISOString();
        let endTime = moment(this.model.extent.time[1]).toISOString();
        console.log('url', this.url);
        let compiled = _.template(this.url);
        let filledUrl = compiled({
          lat: this.lat,
          lon: this.lon,
          startTime: startTime,
          endTime: endTime
        });
        console.log('filled', filledUrl);

        fetch(filledUrl)
          .then((resp) => {
            console.log('resp', resp);
            return resp.json();
          })
          .then((data) => {
            this.series = data.series;
            _.each(this.series, (row) => {
              // parse date
              row.date = moment(row.dateTime);
            });
            this.loading = false;
          });

      }

    }
  });
}());
