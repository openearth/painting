/* global AdvectionFilter, Particles */
var displacementFilter;
var particles;
$(function() {
  'use strict';
  document.addEventListener('model-started', function(modelEvent) {

    var model = modelEvent.detail;
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
    console.log('scale', model.scale);
    displacementFilter = new AdvectionFilter(
      videoSprite,
      {
        scale: model.scale,
        flipv: model.flipv,
        upwind: false
      }
    );
    // Add the video sprite to the stage (not to the container)
    stage.addChild(videoSprite);

    container.filters = [displacementFilter];

    // // create framebuffer with texture source
    var renderTextureFrom = new PIXI.RenderTexture(renderer, width, height);
    var renderSpriteFrom = new PIXI.Sprite(renderTextureFrom);
    // We add what we advect to both rendering and mixing

    // // Create framebuffer with texture target
    var renderTextureTo = new PIXI.RenderTexture(renderer, width, height);

    container.addChild(renderSpriteFrom);
    container.addChild(drawingSprite);

    particles = new Particles(model, drawing, container);
    console.log('created particles', particles);


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

      // canvas is rendered, we can clear, if needed
      if ($('#cleardrawing').is(':checked')) {
        drawingContext.clearRect(0, 0, drawing.width, drawing.height);
      }
      // set the generated texture as input for the next timestep
      renderSpriteFrom.texture = renderTextureTo;
      // swap the names
      var temp = renderTextureFrom;
      renderTextureFrom = renderTextureTo;
      renderTextureTo = temp;
      renderTextureTo.clear();

      particles.step();
      if (particles.particles.length > 500) {
        renderTextureFrom.clear();
      }

    }
    animate();


    // user interface interactions
    function clear3d() {
      renderTextureTo.clear();
      renderTextureFrom.clear();
    }
    $('#clear3d').click(clear3d);

    var slider = $('#n-particles').slider();



    slider.on('change', function(evt){
      var n = evt.value.newValue;
      particles.culling(n);


    });

    $(document).keydown(function(evt) {
      console.log('processing key', evt.which);

      if (evt.which === 80) {
        // p
        console.log('setting particles to', particles.particles.length + 50);
        // updating particles
        particles.culling(particles.particles.length + 50);
      }
      if (evt.which === 67) {
        // clearing screen
        clear3d();
        particles.clear();
      }
    });
  });
});
