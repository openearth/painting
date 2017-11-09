/* global bus */

(function () {
  'use strict';
  Vue.component('color-selection', {
    template: '#color-selection-template',
    props: {
      color: {
        type: Object
      },
      palette: {
        type: Array
      }
    },
    mounted() {
    },
    data: () => {
      return {
        colorToggleOptions: [
          {
            icon: 'colorize',
            value: 'color'
          },
          {
            icon: 'color_lens',
            value: 'palette'
          }
        ],
        colorType: 'color',
        painting: {
          palette: []
        }
      };
    },
    methods: {
      onColorChange: function(val){
        bus.$emit('color-selected', val);
      },
      onPaintingSelected: function(painting) {
        Vue.set(this, 'painting',  painting);
      }
    }
  });

  Vue.component('painting-palettes', {
    template: '#paintings-template',
    data: () => {
      return {
        paintings: []
      };
    },
    mounted: function() {
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
        this.$emit('select', painting);
      }
    }
  });


  Vue.component('palette-chart', {
    template: '#palette-chart-template',
    data: () => {
      return {
      };
    },
    props: {
      palette: {
        type: Array,
        default: function() {return []; }
      }
    },
    mounted: function() {
    },
    watch: {
      palette: function() {
        this.updateChart();
        this.selectAll();
        this.selectPalette();
      }
    },
    computed: {
      svg: {
        get: function() {
          return d3.select('#palette').select('svg');
        },
        cache: false
      },
      selectedColors: {
        get: function() {
          // Select all colors
          let colors = [];
          this.svg.selectAll('circle.active').each(function(d){
            var color = d3.rgb(d.rgb[0] * 255, d.rgb[1] * 255, d.rgb[2] * 255);
            colors.push(color);
          });
          return colors;
        }
      }
    },
    methods: {
      selectPalette() {
        let colors = this.selectedColors;
        bus.$emit('palette-selected', colors);
      },
      deselectAll() {
        var svg = this.svg;
        var circles = svg
            .select('g');
        circles
          .selectAll('circle')
          .classed('active', false);
        this.selectPalette();
      },
      selectAll() {
        var svg = this.svg;
        var circles = svg
            .select('g');
        circles
          .selectAll('circle')
          .classed('active', true);
        this.selectPalette();
     },
      updateChart: function() {
        var width = 260,
            height = 200;
        var svg = this.svg;
        var circles = svg
          .select('g');

        svg
          .attr('width', width)
          .attr('height', height);
        var x = d3.scaleLinear()
              .range([0, width])
              .domain([-0.1, 1.1]).nice();

        var y = d3.scaleLinear()
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
            this.selectPalette();
          });
        // by default select all circles
        this.selectAll();

      }
    }
  });

}());
