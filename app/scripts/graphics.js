'use strict';

function loadVideo(model) {
    var source = $('#video-template').html();
    var template = Handlebars.compile(source);
    var html = template(model);
    $('#uv-container').html(html);
}

function addDrawing(drawingElement, drawingContainer) {
    var sketch = Sketch.create({
        element: drawingElement,
        // if you don't pass a container, Sketch wil append the element to the body
        container: drawingContainer,
        autoclear: false,
        fullscreen: false,
        exists: true,
        palette: ['black', 'white'],
        radius: 3,
        setup: function() {
            console.log( 'setup', this );
        },
        update: function() {
        },
        // Event handlers
        keydown: function() {
        },
        // Mouse & touch events are merged, so handling touch events by default
        // and powering sketches using the touches array is recommended for easy
        // scalability. If you only need to handle the mouse / desktop browsers,
        // use the 0th touch element and you get wider device support for free.
        touchmove: function() {
            for ( var i = this.touches.length - 1, touch; i >= 0; i-- ) {
                touch = this.touches[i];
                this.lineCap = 'round';
                this.lineJoin = 'round';
                this.strokeStyle = this.palette[Math.floor(Math.random()*this.palette.length)];
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

    var sketch;

    // Add the slider
    var slider = $("input.slider").slider();
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
    )

    // Listen for loaded models
    document.addEventListener('model-selected', function(evt){
        var model = evt.detail;
        loadVideo(model);
        sketch = addDrawing($('#drawing')[0], $('#drawingcontainer')[0]);
    });
    fetch('/data/colourlovers.json')
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

