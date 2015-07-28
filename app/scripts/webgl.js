'use strict';
$(function() {
    document.addEventListener('model-started', function(evt) {
        var model = evt.detail;
        console.log('model started', model);
        console.log('looking for webgl context', $('#webgl'));

        // Create Three js renderer
        var webgl = $('#webgl')[0];
        var webglContext = webgl.getContext('webgl');

        //
        var width = webgl.width,
            height = webgl.height;
        var advectStage = new PIXI.Container();
        var mixStage = new PIXI.Container();
        var renderer = new PIXI.WebGLRenderer(
            // width height
            width, height,
            //
            {
                'view': webgl,
                'transparent': true
            }
        );
        console.log('created renderer', renderer);

        // Load the video texture
        var video = $('#uv')[0];
        console.log('video', video);
        var videoTexture = PIXI.Texture.fromVideo(video);
        videoTexture.autoUpdate = true;
        var videoSprite = new PIXI.Sprite(videoTexture);
        advectStage.addChild(videoSprite);
        video.pause();
        video.play();

        // create framebuffer with texture source
        var renderTextureFrom = new PIXI.RenderTexture(renderer, width, height);
        var renderSpriteFrom = new PIXI.Sprite(renderTextureFrom);
        // We add what we advect to both rendering and mixing
        advectStage.addChild(renderSpriteFrom);
        mixStage.addChild(renderSpriteFrom);

        // Create framebuffer with texture target
        var renderTextureTo = new PIXI.RenderTexture(renderer, width, height);

        // load the drawing texture
        var drawing = $('#drawing')[0];
        var drawingContext = drawing.getContext('2d');
        var drawingTexture = PIXI.Texture.fromCanvas(drawing);
        var drawingSprite = new PIXI.Sprite(drawingTexture);
        mixStage.addChild(drawingSprite);




        function animate() {
            // request next animation frame
            requestAnimationFrame(animate);

            // upload the drawing to webgl
            drawingTexture.update();

            if (settings.clear2d) {
                drawingContext.clearRect(0, 0, drawing.width, drawing.height);
            }
            // render to the framebuffer
            renderTextureTo.render(advectStage);
            // and to the screen
            renderer.render(mixStage);

            // set the generated texture as input for the next timestep
            renderSpriteFrom.texture = renderTextureTo;
            // swap the names
            var temp = renderTextureFrom;
            renderTextureFrom = renderTextureTo;
            renderTextureTo = temp;

        }
        animate();
    });
});