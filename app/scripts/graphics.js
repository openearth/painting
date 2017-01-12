/* global bus  */

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
    template: '<div></div>',
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
        bus.$on('model-selected', this.clear);
      });

    },
    methods: {
      clear: function() {
        this.sketch.clear();
      },
      deferredMountedTo: function(parent) {
        /* eslint-disable no-underscore-dangle */
        // named _image due to inheritance
        this.canvas = parent._image;
        /* eslint-enable no-underscore-dangle */
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
          keydown: function(evt) {
            bus.$emit('drawing-keydown', evt, this);

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
          click: function(evt) {
            this.fillStyle = this.palette[Math.floor(Math.random() * this.palette.length)];
            this.beginPath();
            var x = evt.x,
                y = evt.y;
            var r = 1;
            this.arc(x, y, r, 0, 2 * Math.PI);
            this.fill();
            bus.$emit('drawing-click', this);

          },
          // Mouse & touch events are merged, so handling touch events by default
          // and powering sketches using the touches array is recommended for easy
          // scalability. If you only need to handle the mouse / desktop browsers,
          // use the 0th touch element and you get wider device support for free.
          touchmove: function() {
            var isDrawing = Modernizr.touch || this.keys.SHIFT;
            if (!isDrawing) {
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
            bus.$emit('drawing-touchmove', this);
          }

        });

        // set on self
        Vue.set(this, 'sketch', sketch);
        // bubbly bubbly
        this.$nextTick(() => {
          bus.$emit('sketch-created', sketch);
        });
        // emit so it can be caught by app and synced in properties

      },
      grid: function() {
        var drawing = this.sketch;
        _.each(
          _.range(0, 1024, Math.pow(2, 7)),
          (i) => {
            drawing.strokeStyle = 'black';
            drawing.beginPath();
            drawing.moveTo(i, 0);
            drawing.lineTo(i, 1024);
            drawing.closePath();
            drawing.stroke();

            drawing.beginPath();
            drawing.moveTo(0, i);
            drawing.lineTo(1024, i);
            drawing.closePath();
            drawing.stroke();
          }
        );
      },
      quiver: function() {
        var drawing  = this.sketch;
        _.each(
          _.range(0, 100),
          () => {
            var x = Math.random() * 1024;
            var y = Math.random() * 1024;
            drawing.strokeStyle = 'white';
            drawing.beginPath();
            drawing.arc(x, y, 1, 0, 2 * Math.PI);
            drawing.closePath();
            drawing.stroke();
          }
        );
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
