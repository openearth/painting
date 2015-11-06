'use strict';
/*exported sketch */
var sketch;
function loadVideo(model) {
    var source = $('#video-template').html();
    var template = Handlebars.compile(source);
    var html = template(model);
    $('#uv-container').html(html);
}

function addDrawing(drawingElement, drawingContainer) {
    sketch = Sketch.create({
        element: drawingElement,
        // if you don't pass a container, Sketch wil append the element to the body
        container: drawingContainer,
        autoclear: false,
        fullscreen: false,
        exists: true,
        palette: ['black', 'white'],
        radius: 3,
        painting: false,
        hasDragged: true,
        setup: function() {
            console.log( 'drawing setup', this );
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
            console.log('mouseupn dragging', this.dragging);
            this.painting = !this.painting;
            if (this.painting) {
                $('#drawing').addClass('crosshair');
            }
            else {
                $('#drawing').removeClass('crosshair');
            }


        },
        mousedown: function() {
            console.log('mousedown dragging', this.dragging);
            this.hasDragged = false;

        },
        mousemove: function() {
            console.log('mousemove dragging', this.dragging);
            this.hasDragged = true;

        },
        click: function() {
            console.log('click dragging', this.dragging);


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
    return sketch;
}


$(function(){

    // Add the slider
    var slider = $('input.slider').slider();
    slider.on('change', function(evt){
        sketch.radius = evt.value.newValue;
    });


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

    // Listen for loaded models
    document.addEventListener('model-layers', function(evt){
        var model = evt.detail;
        console.log('model layers created', model);
        loadVideo(model);
        // Add model to drawing layer
        sketch = addDrawing($('#drawing')[0], $('#drawingcontainer')[0]);
        var event = new CustomEvent(
            'model-loaded',
            {'detail': model}
        );
        document.dispatchEvent(event);

    });
    fetch('../data/colourlovers.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            var source = $('#colours-template').html();
            var template = Handlebars.compile(source);
            var html = template({'palettes': json});
            $('#colours').html(html);
            _.map(json, function(palette){
                $('#palette' + palette.id).click(function(){
                    console.log(palette.colors, sketch.palette);
                    sketch.palette = _.map(palette.colors, function(x){return '#' + x; });
                });
            });


        })
        .catch(function(ex) {
            console.log('parsing failed', ex);
        });


});
