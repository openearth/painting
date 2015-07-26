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
            console.log('touchmove', this);
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
    addDrawing();
    // Listen for loaded models
    document.addEventListener('model-selected', function(evt){
        var model = evt.detail;
        console.log('model selected', model);
        loadVideo(model);
        var sketch = addDrawing($('#drawing')[0], $('#drawingcontainer')[0]);
        console.log(sketch);
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
        })
        .catch(function(ex) {
            console.log('parsing failed', ex);
        });


});

