$(function() {
    'use strict';
    document.addEventListener('model-started', function(evt) {

        var model = evt.detail;
        console.log('model started', model);
        console.log('looking for webgl context', $('#webgl'));

        // Create WebGL renderer
        var webgl = $('#webgl')[0];

        // get the width/height
        var width = webgl.width,
            height = webgl.height;

        // Define the renderer, explicit webgl (no canvas)
        var renderer = new PIXI.WebGLRenderer(
            width, height,
            {
                'view': webgl,
                'transparent': true
            }
        );
        console.log('created renderer', renderer);

        // Create a container with all elements
        var stage = new PIXI.Container();

        // The container goes in the stage....
        var container = new PIXI.Container();
        stage.addChild(container);


        // load the drawing texture
        var drawing = $('#drawing')[0];
        var drawingContext = drawing.getContext('2d');
        var drawingTexture = PIXI.Texture.fromCanvas(drawing);
        var drawingSprite = new PIXI.Sprite(drawingTexture);
        // drawings go in the container


        // Load the video texture
        var video = $('#uv')[0];
        console.log('video', video);
        // into a texture
        var videoTexture = PIXI.Texture.fromVideo(video);
        var videoSprite = new PIXI.Sprite(videoTexture);
        videoSprite.width = width;
        videoSprite.height = height;
        // Create a render texture
        var displacementFilter = new AdvectionFilter(
            videoSprite
        );
        // Add the video sprite to the stage (not to the container)
        stage.addChild(videoSprite);

        container.filters = [displacementFilter];
        // scale it up
        displacementFilter.scale.x = 2.0;
        displacementFilter.scale.y = 2.0;


        // // create framebuffer with texture source
        var renderTextureFrom = new PIXI.RenderTexture(renderer, width, height);
        var renderSpriteFrom = new PIXI.Sprite(renderTextureFrom);
        // We add what we advect to both rendering and mixing

        // // Create framebuffer with texture target
        var renderTextureTo = new PIXI.RenderTexture(renderer, width, height);

        container.addChild(renderSpriteFrom);
        container.addChild(drawingSprite);


        function animate() {
            // request next animation frame
            requestAnimationFrame(animate);

            videoSprite.scale.y = -1;

            // upload the drawing to webgl
            drawingTexture.update();

            // render to the framebuffer
            // and to the screen
            renderer.render(stage);
            renderTextureTo.render(stage, null, true);

            drawingContext.clearRect(0, 0, drawing.width, drawing.height);
            // set the generated texture as input for the next timestep
            renderSpriteFrom.texture = renderTextureTo;
            // swap the names
            var temp = renderTextureFrom;
            renderTextureFrom = renderTextureTo;
            renderTextureTo = temp;
            renderTextureTo.clear();

        }
        animate();
    });
});
