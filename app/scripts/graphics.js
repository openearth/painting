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

  var Drawing = Vue.component('drawing-canvas', {
    // overwrite data in object constructor
    data: function() {
      return {
        layer: null,
        sketch: null
      };
    },
    mounted: function(){
      this.addDrawing();
    },
    methods: {
      clear: function() {
        this.sketch.clear();
      },
      addDrawing: function() {
        sketch = Sketch.create({
          element: this.$el,
          // if you don't pass a container, Sketch wil append the element to the body
          container: null,
          autoclear: false,
          fullscreen: false,
          exists: true,
          palette: ['black', 'white'],
          radius: 3,
          painting: true,
          hasDragged: true,
          setup: function() {
          },
          update: function() {
          },
          // Event handlers
          keydown: function() {
          },
          mouseup: function() {
            if (this.hasDragged) {
              return;
            }
            this.painting = !this.painting;
            if (this.painting) {
              $('#drawing').addClass('crosshair');
              $('#drawingban').addClass('hide');

            }
            else {
              $('#drawing').removeClass('crosshair');
              $('#drawingban').removeClass('hide');

            }


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
            if (!this.painting ){
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
        this.$set('sketch', sketch);
        // emit so it can be caught by app and synced in properties
        bus.$emit('sketch-created', sketch);
      }
    }
  });

  // Create events if a new layer is loaded
  // create global drawing
  bus.$on('drawing-layer-added', function(obj) {
    // remove the old drawing element
    // pass along the global parent here
    var drawing = new Drawing({
      _ref: 'drawingCanvas',
      data: {
        layer: obj.drawingLayer
      },
      el: obj.drawingElement,
      parent: app
    });
    bus.$emit('drawing-canvas-created', drawing);
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
