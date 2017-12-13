/* global bus */
(function () {
  'use strict';

  Vue.component('pattern-selection', {
    template: '#pattern-selection-template',
    props: {
      repository: {
        type: String,
        default: ''
      }
    },
    data: function() {
      return {
        images: [
          'images/boogiewoogiefilled.jpg',
          'images/mississippiboatman.jpg',
          'images/mississippiraftsman.jpg',
          'images/monalisa.jpg',
          'images/chessboard.png',
          'images/colors.png',
          'images/static.png'
        ]
      };
    },
    mounted: function() {
      bus.$on('download-ready', this.onDownload);
    },
    watch: {
    },
    computed: {
    },
    methods: {
      putImage(url, evt) {
        let img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = function() {
          bus.$emit('pattern-loaded', img);
        };
        img.src = url;
      },
      snapshot() {
        bus.$emit('download-requested');
      },
      onDownload(dt) {
        // hidden download element
        let dl = document.getElementById('dl');
        dl.href = dt;
      }
    }
  });

}());
