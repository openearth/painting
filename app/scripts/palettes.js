/* global bus */

(function () {
  'use strict';

  Vue.component('painting-palettes', {
    template: '#paintings-template',
    data: () => {
      return {
        paintings: []
      };
    },
    ready: function() {
      fetch('data/paintings.json')
        .then((resp) => {
          return resp.json();
        })
        .then((json) => {
          // 'http://www.colourlovers.com/api/palettes/top?format=json',
          this.paintings = json;
          // select the first one
          this.select(this.paintings[0]);
        });
    },
    methods: {
      select: function(painting){
        bus.$emit('palette-selected', painting.palette);
      }
    }
  });

  function updateColors(){
    // Select all colors
    var colors = [];
    d3.selectAll('circle.active').each(function(d){
      var color = d3.rgb(d.rgb[0] * 255, d.rgb[1] * 255, d.rgb[2] * 255);
      colors.push(color);
    });
    if (!_.isNil(sketch)) {
      sketch.palette = colors;
    }
  }

  Vue.component('palette-chart', {
    template: '#palette-chart-template',
    data: () => {
      return {};
    },
    props: {
      palette: {
        type: Array,
        default: function() {return []; }
      }
    },
    ready: function() {
      /* global sketch */
      this.$watch('palette', function(){
        this.updateChart();
      });
    },
    methods: {
      updateChart: function() {
        var width = 300,
            height = 200;
        var svg = d3.select('#palette').select('svg');
        var circles = svg
          .select('g');

        svg
          .attr('width', width)
          .attr('height', height);
        var x = d3.scale.linear()
              .range([0, width])
              .domain([-0.1, 1.1]).nice();

        var y = d3.scale.linear()
              .range([height, 0])
              .domain([-0.1, 1.1]).nice();
        circles
          .selectAll('circle')
          .remove();
        circles
          .selectAll('circle')
          .data(this.palette)
          .enter()
          .append('circle')
          .attr('cx', function(d){return x(d.x); })
          .attr('cy', function(d){return y(d.y); })
          .attr('r', 10)
          .style('fill', function(d) {
            return d3.rgb(d.rgb[0] * 255, d.rgb[1] * 255, d.rgb[2] * 255);
          })
          .on('click', function() {
            // toggle active
            d3.select(this)
              .classed('active', !d3.select(this).classed('active'));
            updateColors();
          });
        // by default select all circles
        circles
          .selectAll('circle')
          .classed('active', true);
        updateColors();

      }
    }
  });












  // select palette if model is loaded
  document.addEventListener('model-loaded', function(){
    updateColors();
  });

}());
