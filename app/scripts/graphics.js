/* global bus, app  */

var sketch;
(function () {

  'use strict';
  /*exported sketch */

  Vue.component('drawing-controls', {
    // controls to change the drawing
    template: '#drawing-controls-template',
    props: ['sketch'],
    data: function() {
      return {
      };
    }
  });

  Vue.component('drawing-canvas', {
    // overwrite data in object constructor
    template: '<div>drawing</div>',
    data: function() {
      return {
        canvas: null,
        sketch: null
      };
    },
    mounted: function(){
      this.addDrawing();
      this.$nextTick(() => {
        bus.$emit('drawing-canvas-created', this);
      });

    },
    methods: {
      clear: function() {
        this.sketch.clear();
      },
      deferredMountedTo: function(parent) {
        console.log('generating painting in layer', parent);
        this.canvas = parent._canvas;
        this.addDrawing();
      },
      addDrawing: function() {
        sketch = Sketch.create({
          element: this.canvas,
          // if you don't pass a container, Sketch wil append the element to the body
          container: null,
          autoclear: false,
          fullscreen: false,
          exists: true,
          palette: ['black', 'green'],
          radius: 3,
          painting: false,
          hasDragged: true,
          setup: function() {
          },
          update: function() {
          },
          // Event handlers
          keydown: function() {
          },
          mouseup: function() {
            // console.log('mouse up', this);
            // if (this.hasDragged) {
            //   return;
            // }
            // this.painting = !this.painting;
            // if (this.painting) {
            //   $('#drawing').addClass('crosshair');
            //   $('#drawingban').addClass('hide');

            // }
            // else {
            //   $('#drawing').removeClass('crosshair');
            //   $('#drawingban').removeClass('hide');

            // }


          },
          mousedown: function() {
            this.hasDragged = false;

          },
          mousemove: function() {
            this.hasDragged = true;

          },
          click: function() {
          },
          // Mouse & touch events are merged, so handling touch events by default
          // and powering sketches using the touches array is recommended for easy
          // scalability. If you only need to handle the mouse / desktop browsers,
          // use the 0th touch element and you get wider device support for free.
          touchmove: function() {
            if (!this.painting && !this.keys.SHIFT){
              return;
            }
            for ( var i = this.touches.length - 1, touch; i >= 0; i-- ) {
              touch = this.touches[i];
              this.lineCap = 'round';
              this.lineJoin = 'round';
              this.strokeStyle = this.palette[Math.floor(Math.random() * this.palette.length)];
              this.lineWidth = this.radius;
              this.beginPath();
              this.moveTo( touch.ox, touch.oy );
              this.lineTo( touch.x, touch.y );
              this.stroke();
            }
          }
        });
        // set on self
        console.log('Setting sketch to', sketch);
        Vue.set(this, 'sketch', sketch);
        // bubbly bubbly
        this.$nextTick(() => {
          bus.$emit('sketch-created', sketch);
        });
        // emit so it can be caught by app and synced in properties

      }
    }
  });



  // hook up to all thumbnails
  $(function(){

    // Add event handlers to images
    $('#images a.thumbnail').click(
      function(evt){
        // find the image source
        var src = $(evt.currentTarget).find('img').attr('src');

        // draw it on the canvas
        var img = new Image();
        img.onload = function() {
          sketch.drawImage(img, 0, 0);
        };
        img.src = src;

        evt.preventDefault();
      }
    );



  });

}());
