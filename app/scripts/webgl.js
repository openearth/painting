/* global AdvectionFilter */
var displacementFilter;
var particles;
var sprites;
var icon = 'images/bar.png';
var particleAlpha = 0.6;
function updateParticles() {

  var uv = $('#uv')[0];
  if (uv.paused || uv.ended) {
    return;
  }
  if (displayed) {

  }
  displayed = true;

  var uvhidden = $('#uvhidden')[0];
  var uvctx = uvhidden.getContext('2d');
  var width = uvhidden.width,
      height = uvhidden.height;
  uvctx.drawImage(uv, 0, 0, width, height);
  var frame = uvctx.getImageData(0, 0, width, height);

  _.each(particles, function(particle, i){
    var idx = (
      Math.round(height - particle.position.y) * width +
        Math.round(particle.position.x)
    ) * 4;
    var u = (frame.data[idx + 0] / 255.0) - 0.5;
    var v = (frame.data[idx + 1] / 255.0) - 0.5 ;
        v = v * (displacementFilter.uniforms.flipv.value ? 1 : -1);
    var mask = (frame.data[idx + 2] / 255.0) > 0.5 ;
    mask = mask || (Math.abs(u) + Math.abs(v) == 0.0);
    particle.position.x =  particle.position.x + u*2;
    particle.position.y = particle.position.y + -v*2;
    particle.rotation = Math.atan2(u, v) - (0.5 * Math.PI);
    if (mask) {
      _.pull(particles, particle);
      sprites.removeChild(particle);

      // replace it
      var newParticle = PIXI.Sprite.fromImage(icon);
      // set anchor to center
      newParticle.alpha = particleAlpha;
      newParticle.anchor.set(0.5);
      newParticle.x = Math.random() * width;
      newParticle.y = Math.random() * height;
      // add to array and to particle container
      particles.push(newParticle);
      sprites.addChild(newParticle);

    }


  });


}
var displayed = false;
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
    // scale it up
    displacementFilter.scale.x = 2.0;
    displacementFilter.scale.y = 2.0;
    console.log(displacementFilter)

    // // create framebuffer with texture source
    var renderTextureFrom = new PIXI.RenderTexture(renderer, width, height);
    var renderSpriteFrom = new PIXI.Sprite(renderTextureFrom);
    // We add what we advect to both rendering and mixing

    // // Create framebuffer with texture target
    var renderTextureTo = new PIXI.RenderTexture(renderer, width, height);

    container.addChild(renderSpriteFrom);
    container.addChild(drawingSprite);

    var n = 0;
    sprites = new PIXI.ParticleContainer(n, {
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true
    });
    container.addChild(sprites);
    particles = [];
    for(var i = 0; i < n; i++) {
      var particle = PIXI.Sprite.fromImage(icon);
      // set anchor to center
      particle.anchor.set(0.5);
      particle.alpha = particleAlpha;
      particle.x = Math.random() * renderer.width;
      particle.y = Math.random() * renderer.height;
      // add to array and to particle container
      particles.push(particle);
      sprites.addChild(particle);
    }



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

      updateParticles();
      if (particles.length > 500) {
        renderTextureFrom.clear();
      }
    }
    animate();

    function clear3d() {
      renderTextureTo.clear();
      renderTextureFrom.clear();
    }
    $('#clear3d').click(clear3d);

    var slider = $('#n-particles').slider();
    slider.on('change', function(evt){
      console.log('using', evt.value.newValue, 'particles');
      var nCurrent = particles.length;
      var nNew = evt.value.newValue;


      for (var i = nCurrent-1; i > nNew; i--) {
        _.pullAt(particles, i);
        sprites.removeChildAt(i);
      }

      for(var i = 0; i < nNew - nCurrent; i++) {

        // replace it
        var newParticle = PIXI.Sprite.fromImage(icon);
        // set anchor to center
        newParticle.anchor.set(0.5);
        newParticle.alpha = particleAlpha;
        newParticle.x = Math.random() * width;
        newParticle.y = Math.random() * height;
        // add to array and to particle container
        particles.push(newParticle);
        sprites.addChild(newParticle);
      }

    });


  });
});
