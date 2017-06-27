/* global bus */
(function () {
  'use strict';

  function Particles(model, canvas, uv) {
    this.model = model;
    this.canvas = canvas;
    this.uv = uv;
    this.width = canvas.width;
    this.height = canvas.height;
    this.particleAlpha = 0.8;
    this.replace = true;
    this.particles = [];
    this.color = 'rgba(255, 91, 126, 0.8)';
    this.r = 1;
    this.fade = 0.95;
    this.counter = 0;
    this.state = 'STOPPED';
    // create offscreen buffer
    this.offScreen = document.createElement('canvas');
    this.offScreen.width = this.canvas.width;
    this.offScreen.height = this.canvas.height;
  }


  Particles.prototype.startAnimate = function() {

    // throttle down because we're running on the CPU
    var fps = 15;
    var now = Date.now();
    var then = Date.now();
    var interval = 1000 / fps;
    var delta;
    this.state = 'STARTED';

    function animate() {
      if (this.state === 'STOPPED') {
        return;
      }
      requestAnimationFrame(animate.bind(this));
      now = Date.now();
      delta = now - then;
      if (delta < interval) {
        return;
      }
      if (!(this.particles.length)) {
        return;
      }
      // speed up to keep up with default fps
      this.step(60 / fps);
      this.render();
      then = now - (delta % interval);
    }
    animate.bind(this)();
  };

  Particles.prototype.stopAnimate = function() {
    this.state = 'STOPPED';
  };

  Particles.prototype.create = function() {
    // replace it
    var newParticle = new PIXI.Sprite();
    // set anchor to center
    newParticle.anchor.set(0.5);
    newParticle.alpha = this.particleAlpha;
    newParticle.x = Math.random() * this.width;
    newParticle.y = Math.random() * this.height;
    return newParticle;
  };

  Particles.prototype.clear = function () {
    // clear particles (delete from 0 to length)
    this.particles.splice(0);
    var ctx = this.canvas.getContext('2d');
    // get the size
    var width = this.canvas.width;
    var height = this.canvas.height;
    // render buffer to keep a trail
    var offscreen = this.offScreen.getContext('2d');
    offscreen.clearRect(0, 0, width, height);
    ctx.clearRect(0, 0, width, height);

  };

  Particles.prototype.culling = function (n) {
    // make sure we have n particles by breeding or culling
    // also update the sprites

    var nCurrent = this.particles.length;
    var nNew = n;

    // culling
    for (var i = nCurrent - 1; i >= nNew; i--) {
      _.pullAt(this.particles, i);
      this.sprites.removeChildAt(i);
    }

    // add extra particles
    for(var j = 0; j < nNew - nCurrent; j++) {
      var newParticle = this.create();
      // add to array and to particle container
      this.particles.push(newParticle);
    }
  };

  Particles.prototype.step = function (speedup) {
    if (!this.particles.length) {
      return;
    }
    if (this.uv.paused || this.uv.ended) {
      return;
    }

    const scale = _.get(this.model, 'uniforms.scale', 2.0);

    var uvCanvas = $('#uv-canvas')[0];
    var uvctx = uvCanvas.getContext('2d');
    var width = uvCanvas.width,
        height = uvCanvas.height;

    // TODO: Move this to uv-source
    var frame = uvctx.getImageData(0, 0, width, height);

    // TODO: we need some dt here..
    _.each(this.particles, (particle) => {
      var idx = (
        Math.round(height - particle.position.y) * width +
          Math.round(particle.position.x)
      ) * 4;
      var u = (frame.data[idx + 0] / 255.0) - 0.5;
      var v = (frame.data[idx + 1] / 255.0) - 0.5;
      v = v * (this.model.flipv ? 1 : -1);
      // is blue
      var mask = (frame.data[idx + 2] / 255.0) > 0.5;
      // velocity is zero
      mask = mask || (Math.abs(u) + Math.abs(v) === 0.0);
      // update the position
      particle.position.x = particle.position.x + u * scale * speedup;
      particle.position.y = particle.position.y + v * scale * speedup;
      mask = mask || particle.position.x > width;
      mask = mask || particle.position.x < 0;
      mask = mask || particle.position.y > height - 1;
      mask = mask || particle.position.y < 10;
      // how do we get nans here....
      mask = mask || isNaN(particle.position.x);
      mask = mask || isNaN(particle.position.y);

      // var newRotation = Math.atan2(u, v * (this.model.flipv ? -1 : 1)) - (0.5 * Math.PI);
      var newRotation = Math.atan2(v, u ) - (0.5 * Math.PI);
      // TODO: fix circles (mod something...)
      var rotationDiff = newRotation - particle.rotation;
      var maxRotation = 0.1;
      if (Math.abs(rotationDiff) > maxRotation) {
        // limit
        rotationDiff = rotationDiff > 0.0 ? maxRotation : -maxRotation;
      }
      particle.rotation += rotationDiff;

      // replace dead particles
      if (mask) {
        _.pull(this.particles, particle);
        if (this.replace) {
          var newParticle = this.create();
          // add to array and to particle container
          this.particles.push(newParticle);
        }

      }
    }, this);
    this.counter++;
  };
  Particles.prototype.render = function() {
    var ctx = this.canvas.getContext('2d');

    // get the size
    var width = this.canvas.width;
    var height = this.canvas.height;

    // render buffer to keep a trail
    var offScreen = this.offScreen.getContext('2d');

    //
    if (this.counter % 20 === 0) {
      // cleanup every 20 timesteps
      var imageData = ctx.getImageData(0, 0, width, height);
      var data = imageData.data;
      var fade = this.fade;
      for(var i = 0, n = data.length; i < n; i += 4) {

        var alpha = data[i + 3];
        if (alpha <= (1 - fade)) {
          data[i + 3] = 0.0;
        }
      }

      // pingpong
      // offscreen.drawImage(this.canvas, 0, 0);
      offScreen.putImageData(imageData, 0, 0);

    } else {
      // No need to clear the screen fi we composite copy
      offScreen.globalCompositeOperation = 'copy';

      // offscreen.fillStyle = 'white';
      // offScreen.clearRect(0, 0, width, height);
      offScreen.drawImage(this.canvas, 0, 0);
    }


    // clear current screen
    ctx.fillStyle = 'white';
    ctx.clearRect(0, 0, width, height);
    // alpha determines length of the trail

    ctx.globalAlpha = this.fade;
    ctx.drawImage(this.offScreen, 0, 0);
    ctx.globalAlpha = 1.0;
    // somehow this is not working properly,
    // triad to map color
    ctx.fillStyle = this.color;
    // plot all points at once
    ctx.beginPath();

    // bit of aliasing
    var r = this.r;
    _.each(this.particles, (particle) => {
      // fixes the stroke
      ctx.moveTo(particle.x + r, particle.y);
      ctx.arc(particle.x, particle.y, r, 0, 2 * Math.PI);
    });
    ctx.closePath();
    ctx.fill();


  };



  Vue.component('particle-component', {
    template: '#particle-component-template',
    props: ['model'],
    data: function() {
      return {
        particles: null,
        pipeline: null,
        stage: null,
        renderer: null,
        canvas: null
      };
    },
    mounted: function() {
      // find the first video in this container
      bus.$on('model-selected', this.resetParticles);

    },
    watch: {
      'model.uv': 'resetParticles',
      'pipeline': 'resetParticles'
    },
    computed: {
      radius: {
        get() {
          return _.get(this.particles, 'r');
        },
        set(val) {
          this.particles.r = val;
        },
        cache: false
      },
      width: {
        get: function() {
          return _.get(this, 'canvas.width');
        }
      },
      height: {
        get: function() {
          return _.get(this, 'canvas.height');
        }
      }
    },
    methods: {
      deferredMountedTo: function(parent) {
        /* eslint-disable no-underscore-dangle */
        // named _image due to inheritance
        this.canvas = parent._image;

        /* eslint-enable no-underscore-dangle */
        if (_.isNil(this.model)) {
          return;
        }
        var uv = $('#uv-' + this.model.uv.tag)[0];
        if (this.particles) {
          this.particles.stopAnimate();
        }
        Vue.set(this, 'particles', new Particles(this.model, this.canvas, uv, {radius: this.radius}));

        this.particles.startAnimate();

      },
      resetParticles: function(){
        if (_.isNil(this.model) || _.isNil(this.canvas)) {
          return;
        }
        var uv = $('#uv-' + this.model.uv.tag)[0];
        // remove old particles
        this.clear();
        Vue.set(this, 'particles', new Particles(this.model, this.canvas, uv));
        this.particles.startAnimate();
        this.add();
      },
      add: function() {
        if (_.isNil(this.model)) {
          return;
        }
        if (_.isNil(this.particles)) {
          return;
        }
        this.particles.culling(this.particles.particles.length + 50);
      },
      removeParticles: function() {
        if (this.particles) {
          this.particles.clear();
        }
      },
      clear: function() {
        this.removeParticles();
      }

    }
  });




}());
