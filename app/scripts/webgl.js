/* global AdvectionFilter, bus */
(function () {
  'use strict';

  Vue.component('uv-source', {
    template: '#uv-source-template',
    props: {
      model: {
        type: Object,
        required: false
      }
    },
    data: function() {
      return {
        loaded: false
      };
    },
    mounted: function() {
      // no need to do this too fast (getting image from gpu to cpu takes some time)
      var fps = 10;
      var now = Date.now();
      var then = Date.now();
      var interval = 1000 / fps;
      var delta;

      this.$nextTick(() => {
        // return the canvas that corresponds to the video

      });
      // create an animation function that draws the video into a 2d canvas
      function animate() {
        requestAnimationFrame(animate.bind(this));
        now = Date.now();
        delta = now - then;
        if (!this.video) {
          return;
        }
        if (!this.uvctx) {
          return;
        }

        let width = this.video.width;
        let height = this.video.height;
        // TODO: this is expensive
        this.uvctx.drawImage(this.video, 0, 0, width, height);
        then = now - (delta % interval);
      }
      animate.bind(this)();

    },
    watch: {
      uv: function(uv) {
        // new uv, create a new video
        var video = this.video;
        video.src = uv.src;
        video.height = uv.height;
        video.width = uv.width;
        // send this event once
        if (this.model.uv.tag === 'video') {
          // if it's really a video, bind to data update
          this.video.currentTime = this.video.currentTime;
          $(this.video).bind('loadeddata', () => {
            this.loaded = true;
            Vue.set(this.model, 'duration', this.video.duration);
          });
          $(this.video).bind('timeupdate', () => {
            Vue.set(this.model, 'currentTime', this.video.currentTime);
          });
        }
        // load the url
        video.load();
        bus.$emit('video-loaded', video);

      }
    },
    computed: {
      tag: {
        get: function() {
          return _.get(this, 'model.uv.tag', 'video');
        },
        cache: false
      },
      uv: {
        get: function() {
          if (this.model) {
            return this.model.uv;
          }
          else {
            return null;
          }
        },
        cache: false
      },
      video: {
        get: function() {
          return document.getElementById('uv-video');
        },
        cache: false

      },
      uvctx: {
        get: function() {
          var uvHidden = document.getElementById('uv-hidden');
          return uvHidden.getContext('2d');
        },
        cache: false

      },
      img: {
        get: function() {
          return document.getElementById('uv-img');
        },
        cache: false

      }
    }
  });



  Vue.component('model-canvas', {
    template: '<div>model</div>',
    props: {
      model: {
        type: Object,
        required: false
      },
      sketch: {
        type: CanvasRenderingContext2D,
        required: false
      }

    },
    data: function() {
      return {
        state: 'STOPPED',
        // do we need these:
        drawingTexture: null,
        videoElement: null,
        videoSprite: null,
        stage: null,
        renderer: null,
        renderTextureFrom: null,
        renderTextureTo: null,
        pipeline: null,
        advectionFilter: null,
        clearAfterRender: true
      };
    },
    mounted: function() {
      bus.$on('video-loaded', function(video) {
        // video is loaded, we should be able to create the renderer.
        this.createVideoTexture(video);
        this.checkAndRun();
      }.bind(this));
      Vue.nextTick(() => {
        bus.$on('model-selected', this.clear);
      });

    },
    computed: {
      width: {
        get: function() {
          return _.get(this, 'canvas.width');
        }
      },
      height: {
        get: function() {
          return _.get(this, 'canvas.height');
        }
      },
      drawing: {
        get: function() {
          return _.get(this, 'sketch');
        },
        cache: false
      }
    },
    watch: {
      'model.uniforms': function() {
        this.updateUniforms();
      },
      drawing: function(drawing) {
        if (!drawing) {
          return;
        }
        this.createDrawingTexture(drawing);
        this.checkAndRun();
      }
    },
    methods: {
      checkAndRun: function() {
        if (!this.videoSprite || !this.drawingSprite) {
          return;
        }
        if (this.advectionFilter) {
          return;
        }
        this.createFilter();
        this.startAnimate();
        this.updateUniforms();
      },
      clear: function () {
        var blank = new PIXI.Container();

        // clear
        this.renderer.render(blank, this.renderTextureTo, true);
        this.renderer.render(blank, this.renderTextureFrom, true);
      },
      deferredMountedTo: function(parent) {
        /* eslint-disable no-underscore-dangle */
        // named _image due to inheritance
        this.canvas = parent._image;
        /* eslint-enable no-underscore-dangle */
        this.createRenderer();
      },
      createRenderer: function() {
        // Define the renderer, explicit webgl (no canvas)
        var renderer = new PIXI.WebGLRenderer(
          this.width, this.height,
          {
            'view': this.canvas,
            'transparent': true,
            clearBeforeRender: false,
            preserveDrawingBuffer: false

          }

        );
        // Create a container with all elements
        var stage = new PIXI.Container();
        // The container goes in the stage....
        var pipeline = new PIXI.Container();
        Vue.set(this, 'pipeline', pipeline);
        Vue.set(this, 'stage', stage);
        Vue.set(this, 'renderer', renderer);
      },
      createVideoTexture: function(video) {
        // We're using the canvas that is rendered to a canvas so we don't have any issues with half loaded videos
        var videoTexture = PIXI.Texture.fromVideo(video);
        var videoSprite = new PIXI.Sprite(videoTexture);
        videoSprite.width = this.width;
        videoSprite.height = this.height;
        if (this.videoSprite) {
          // replace it
          var index = this.stage.getChildIndex(this.videoSprite);
          this.stage.removeChildAt(index);
          this.stage.addChildAt(videoSprite, index);
        } else {
          // add it
          this.stage.addChild(videoSprite);
        }
        this.videoSprite = videoSprite;
        if (this.advectionFilter) {
          this.advectionFilter.map = videoSprite.texture;
        }
        videoSprite.renderable = false;
        this.stage.addChild(this.videoSprite);

      },
      createDrawingTexture: function(drawing) {
        if (!drawing) {
          console.warn('Expected a drawing canvas');
          return;
        }
        // load the drawing texture
        var drawingContext = drawing;
        var drawingTexture = PIXI.Texture.fromCanvas(drawing.element);
        var drawingSprite = new PIXI.Sprite(drawingTexture);
        // drawings go in the container
        this.drawingContext = drawingContext;
        this.drawingSprite = drawingSprite;
        this.drawingTexture = drawingTexture;
      },
      updateUniforms: function() {
        if (!this.advectionFilter || !this.model) {
          return;
        }
        var model = this.model;
        this.advectionFilter.scale.x = model.uniforms.scale;
        this.advectionFilter.scale.y = model.uniforms.scale;
        this.advectionFilter.flipv = model.uniforms.flipv;
        this.advectionFilter.decay = model.uniforms.decay;

      },
      createFilter: function() {

        var videoSprite = this.videoSprite;
        var width = this.width;
        var height = this.height;

        // the ppipeline goes in the stage
        this.stage.addChild(this.pipeline);
        // setup the pipeline
        this.pipeline.addChild(this.drawingSprite);
        // Create a render texture
        var advectionFilter = new AdvectionFilter(
          videoSprite,
          {
            scale: 1.0,
            flipv: false,
            decay: 0.99,
            upwind: false
          }
        );
        // Add the video sprite to the stage (not to the pipeline (it should not be rendered))
        this.stage.addChild(videoSprite);
        this.pipeline.filters = [advectionFilter];

        // // create framebuffer with texture source
        var renderTextureFrom = PIXI.RenderTexture.create(width, height);
        var renderSpriteFrom = new PIXI.Sprite(renderTextureFrom);
        // We add what we advect to both rendering and mixing

        // // Create framebuffer with texture target
        var renderTextureTo = PIXI.RenderTexture.create(width, height);
        this.renderTextureFrom = renderTextureFrom;
        this.renderTextureTo = renderTextureTo;
        this.renderSpriteFrom = renderSpriteFrom;
        this.pipeline.addChild(renderSpriteFrom);
        this.pipeline.addChild(this.drawingSprite);
        this.advectionFilter = advectionFilter;
        this.$nextTick(() => {
          bus.$emit('pipeline-created', this.pipeline);
        });
      },
      stopAnimage: function() {
        this.state = 'STOPPED';
      },
      startAnimate: function() {
        this.state = 'STARTED';
        var videoSprite = this.videoSprite;
        var drawingTexture = this.drawingTexture;
        var renderer = this.renderer;
        var renderTextureTo = this.renderTextureTo;
        var renderTextureFrom = this.renderTextureFrom;
        var renderSpriteFrom = this.renderSpriteFrom;
        var stage = this.stage;
        var drawingContext = this.drawingContext;
        var state = this.state;
        var drawing = this.drawing;

        var blank = new PIXI.Container();

        // define animation function.
        function animate () {
          if (state === 'STOPPED') {
            return;
          }
          // request next animation frame
          requestAnimationFrame(animate.bind(this));

          // get latest videoSprite
          videoSprite = this.videoSprite;

          // video not valid, don't bother rendering
          if (!videoSprite.texture.valid) {
            return;
          }

          if (!videoSprite.texture.baseTexture.hasLoaded) {
            return;
          }
          var video = videoSprite.texture.baseTexture.source;
          if (video.readyState < video.HAVE_ENOUGH_DATA) {
            return;
          }
          if (stage.children.indexOf(videoSprite) === -1) {
            return;
          }





          // upload the drawing to webgl
          drawingTexture.update();

          // render to the framebuffer
          // and to the screen
          renderer.render(stage);
          renderer.render(stage, renderTextureTo, true);

          // set the generated texture as input for the next timestep
          renderSpriteFrom.texture = renderTextureTo;
          // swap the names
          var temp = renderTextureFrom;
          renderTextureFrom = renderTextureTo;
          renderTextureTo = temp;
          if (this.clearAfterRender) {
            // clear
            renderer.render(blank, renderTextureTo, true);
            // canvas is rendered, we can clear, if needed
            drawingContext.clearRect(0, 0, drawing.element.width, drawing.element.height);
          }
        }
        animate.bind(this)();

      }
    }
  });

}());
