/* global AdvectionFilter, Particles */
var displacementFilter;
var particles;

(function () {


  Vue.component('uv-source', {
    template: '#uv-source-template',
    props: ['model'],
    data: function() {
      return {
        loaded: false
      };
    },
    watch: {
      'model': 'modelUpdate'
    },
    ready: function() {
      // find the first video in this container
    },
    methods: {
      modelUpdate: function(){
        this.loaded = false;
        // model was updated
        // wait for the dom to be updated
        this.$nextTick(() => {
          console.log('watching video for load');
          if (!(this.model.uv.tag === 'video')) {
            // no video available
            console.log('no video model', this.model.uv);
            return;
          }
          var video = $(this.$el).find('video').first();
          video[0].currentTime = video[0].currentTime;
          video.bind('loadeddata', () => {
            console.log('video loaded');
            this.loaded = true;
          });

        });
      }
    }
  });



  var ModelCanvas = Vue.component('model-canvas', {
    data: function() {
      return {
        model: null,
        modelElement: null,
        drawingElement: null,
        renderTextureFrom: null,
        renderTextureTo: null
      };
    },
    ready: function() {
      this.createContext();
    },
    methods: {
      clear3d: function () {
        this.renderTextureTo.clear();
        this.renderTextureFrom.clear();
      },
      createContext: function() {
        console.log('creating new canvas context');
        var model = this.model;

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
        // Create a container with all elements
        var stage = new PIXI.Container();

        // The container goes in the stage....
        var container = new PIXI.Container();
        stage.addChild(container);


        // load the drawing texture
        var drawing = this.drawingElement;
        var drawingContext = drawing.getContext('2d');
        var drawingTexture = PIXI.Texture.fromCanvas(drawing);
        var drawingSprite = new PIXI.Sprite(drawingTexture);
        // drawings go in the container

        // Load the video texture
        var video = document.getElementById('uv');
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

        // // create framebuffer with texture source
        var renderTextureFrom = new PIXI.RenderTexture(renderer, width, height);
        var renderSpriteFrom = new PIXI.Sprite(renderTextureFrom);
        // We add what we advect to both rendering and mixing

        // // Create framebuffer with texture target
        var renderTextureTo = new PIXI.RenderTexture(renderer, width, height);

        container.addChild(renderSpriteFrom);
        container.addChild(drawingSprite);

        particles = new Particles(model, drawing, container);


        function animate () {
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
        $('#clear3d').click(this.clear3d);





        $(document).keydown(function(evt) {

          if (evt.which === 80) {
            // p
            // updating particles
            particles.culling(particles.particles.length + 50);
          }
          if (evt.which === 67) {
            // clearing screen
            this.clear3d();
            particles.clear();
          }
        });
      }
    }
  });

  // Create events if a new layer is loaded
  // create global drawing
  bus.$on('model-layer-added', function(obj) {
    // remove the old drawing element
    // pass along the global parent here
    var modelCanvas = new ModelCanvas({
      data: {
        layer: obj.modelLayer,
        modelElement: obj.modelElement,
        drawingElement: obj.drawingElement,
        model: obj.model
      },
      el: obj.modelElement,
      parent: app
    });

  });


}());
