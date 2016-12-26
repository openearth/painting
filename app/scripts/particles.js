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
    this.counter = 0;
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

    function animate() {
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
    // clear particles
    this.particles = [];
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


    var uvhidden = $('#uv-hidden')[0];
    var uvctx = uvhidden.getContext('2d');
    var width = uvhidden.width,
        height = uvhidden.height;

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
      particle.position.x = particle.position.x + u * this.model.uniforms.scale * speedup;
      particle.position.y = particle.position.y + v * this.model.uniforms.scale * speedup;
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

    // bit of aliasing
    var r = 3;
    // render buffer to keep a trail
    var offscreen = this.offScreen.getContext('2d');

    // clear
    offscreen.clearRect(0, 0, width, height);
    // alpha determines length of the trail
    offscreen.globalAlpha = 0.95;
    // pingpong
    offscreen.drawImage(this.canvas, 0, 0);
    ctx.clearRect(0, 0, width, height);
    // somehow this is not working properly,
    // triad to map color
    ctx.fillStyle = 'rgba(255, 91, 126, 0.5)';
    // plot all points at once
    ctx.beginPath();
    _.each(this.particles, (particle) => {
      // fixes the stroke
      ctx.moveTo(particle.x + r, particle.y);
      ctx.arc(particle.x, particle.y, r, 0, 2 * Math.PI);
    });
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.drawImage(this.offScreen, 0, 0);


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
        this.particles = new Particles(this.model, this.canvas, uv);
        this.particles.startAnimate();

      },
      resetParticles: function(){
        if (_.isNil(this.model)) {
          return;
        }
        var uv = $('#uv-' + this.model.uv.tag)[0];


        this.particles = new Particles(this.model, this.canvas, uv);
        this.particles.startAnimate();
      },
      addParticles: function() {
        if (_.isNil(this.model)) {
          return;
        }
        if (_.isNil(this.particles)) {
          return;
        }
        this.particles.culling(this.particles.particles.length + 50);
      },
      removeParticles: function() {
        this.model.particles.culling(0);
      }
    }
  });




}());
