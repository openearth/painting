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
      // find the first video in this container

      var fps = 15;
      var now;
      var then = Date.now();
      var interval = 1000/fps;
      var delta;
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

      };
      animate.bind(this)();

    },
    watch: {
      uv: function(uv) {
        var video = this.video;
        video.src = uv.src;
        video.height = uv.height;
        video.width = uv.width;
        video.load();
        // send this event once
        console.log('firing video-loaded');
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
          if (_.isNil(uvHidden)) {
            return null;
          }
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
    },
    methods: {
      modelUpdate: function(){
        this.loaded = false;
        // model was updated
        // wait for the dom to be updated
        console.log('tick tock', this.model);
        if (!(this.model.uv.tag === 'video')) {
          // no video available
          console.log('no video model', this.model.uv);
          return;
        }
        console.log('new video', this.video);

        this.video.load();
        this.video.currentTime = this.video.currentTime;
        this.video.bind('loadeddata', () => {
          console.log('video loaded');
          this.loaded = true;
          Vue.set(this.model, 'duration', this.video.duration);
        });
        this.video.bind('timeupdate', () => {
          Vue.set(this.model, 'currentTime', this.video.currentTime);
        });


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
        advectionFilter: null
      };
    },
    mounted: function() {
      bus.$on('video-loaded', function(video) {
        console.log('got new video event', video);
        this.video = video;
      }.bind(this));
      Vue.nextTick(() => {
        console.info('mounted next', this, this.canvas);
        bus.$on('model-selected', this.clear3d);
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
      },
      video: {
        get: function() {
          return this.videoElement;
        },
        set: function(video) {
          console.log('new video', video, 'creating new sprite');
          this.videoElement = video;
          var videoTexture = PIXI.Texture.fromVideo(video);
          var videoSprite = new PIXI.Sprite(videoTexture);
          videoSprite.width = this.width;
          videoSprite.height = this.height;
          this.videoSprite = videoSprite;
        },
        cache: false
      }
    },
    watch: {
      'model.uv': function() {
        console.log('new model in', this.model.uv);
        this.$nextTick(() => {
          this.createFilter();
          this.startAnimate();
          this.updateUniforms(this.model);
        });
      },
      drawing: function(drawing) {
        console.info('Drawing changed to', drawing);
        if (!drawing) {
          return;
        } else {
          console.log('Drawing changed, generating textures for', drawing);
        }
        this.createDrawingTexture(drawing);
      }
    },
    methods: {
      clear3d: function () {
        if (_.isNil(this.renderTextureFrom)) {
          return;
        }
        console.log('clearing 3d');
        this.renderTextureFrom.clear();
        this.renderTextureTo.clear();
      },
      deferredMountedTo: function(parent) {
        console.log('Generating model canvas in layer', parent);
        /* eslint-disable no-underscore-dangle */
        // named _image due to inheritance
        this.canvas = parent._image;
        /* eslint-enable no-underscore-dangle */
        this.createRenderer();
      },
      createRenderer: function() {
        console.log('creating new canvas context', this);
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
      createDrawingTexture: function(drawing) {
        if (!drawing) {
          return;
        } else {
          console.info('setting drawing to', drawing);
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
      updateUniforms: function(model) {
        if (!this.advectionFilter) {
          return;
        }
        this.advectionFilter.uniforms.scale.value.x = model.scale;
        this.advectionFilter.uniforms.scale.value.y = model.scale;
        this.advectionFilter.uniforms.flipv.value = model.flipv;
        this.advectionFilter.uniforms.decay.value = model.decay;

      },
      createFilter: function() {

        if (!_.isNil(this.renderTextureFrom)) {
          console.warn('filter already set');
          return;
        }
        if (!this.pipeline) {
          console.warn('no pipeline yet');
          return;
        } else {
          console.log('setting filter to', this.pipeline);
        }

        if (!this.model) {
          console.warn('no model yet');
          return;
        } else {
          console.log('setting filter for model', this.model);
        }

        if (!this.videoSprite) {
          console.warn('no videosprite yet');
          return;
        } else {
          console.log('setting filter for videoSprite', this.videoSprite);
        }

        var videoSprite = this.videoSprite;
        var model = this.model;
        var renderer = this.renderer;
        var width = this.width;
        var height = this.height;

        // the ppipeline goes in the stage
        this.stage.addChild(this.pipeline);
        // setup the pipeline
        this.pipeline.addChild(this.drawingSprite);
        // Create a render texture
        this.advectionFilter = new AdvectionFilter(
          videoSprite,
          {
            scale: model.scale,
            flipv: model.flipv,
            decay: model.decay,
            upwind: false
          }
        );
        // Add the video sprite to the stage (not to the pipeline (it should not be rendered))
        this.stage.addChild(videoSprite);
        this.pipeline.filters = [this.advectionFilter];

        // // create framebuffer with texture source
        var renderTextureFrom = new PIXI.RenderTexture(renderer, width, height);
        var renderSpriteFrom = new PIXI.Sprite(renderTextureFrom);
        // We add what we advect to both rendering and mixing

        // // Create framebuffer with texture target
        var renderTextureTo = new PIXI.RenderTexture(renderer, width, height);
        this.renderTextureFrom = renderTextureFrom;
        this.renderTextureTo = renderTextureTo;
        this.renderSpriteFrom = renderSpriteFrom;
        this.pipeline.addChild(renderSpriteFrom);
        this.pipeline.addChild(this.drawingSprite);
        this.$nextTick(() => {
          bus.$emit('pipeline-created', this.pipeline);
        });
      },
      stopAnimage: function() {
        this.state = 'STOPPED';
      },
      startAnimate: function() {
        if (!this.drawingTexture) {
          this.state = 'STOPPED';
          console.warn('Starting animation but drawingTexture is', this.drawingTexture);
          return;
        }
        if (!this.video) {
          this.state = 'STOPPED';
          console.warn('Starting animation but video is', this.video);
          return;

        }
        if (!this.videoSprite) {
          this.state = 'STOPPED';
          console.warn('Starting animation but videoSprite is', this.videoSprite);
          return;

        }
        this.state = 'STARTED';
        var video = this.video;
        var videoSprite = this.videoSprite;
        var drawingTexture = this.drawingTexture;
        var renderer = this.renderer;
        var renderTextureTo = this.renderTextureTo;
        var renderTextureFrom = this.renderTextureFrom;
        var renderSpriteFrom = this.renderSpriteFrom;
        var model = this.model;
        var stage = this.stage;
        var drawingContext = this.drawingContext;
        var state = this.state;
        var drawing = this.drawing;

        // define animation function.
        function animate () {
          if (state === 'STOPPED') {
            return;
          }
          // request next animation frame
          requestAnimationFrame(animate.bind(this));

          if (video.readyState < video.HAVE_ENOUGH_DATA) {
            console.debug('video does not have enough data');
            return;
          }

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
        }
        animate.bind(this)();

        // TODO: move these out of here
        // user interface interactions
        $('#clear3d').click(this.clear3d);

      }
    }
  });

}());
