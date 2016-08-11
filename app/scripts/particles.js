function Particles(model, canvas, container) {
  'use strict';
  console.log('creating particle system');
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.canvasIcon = $('#canvas-icon')[0];
  this.drawIcon();
  this.model = model;
  this.icon = 'images/boatwhite.png';
  this.particleAlpha = 0.6;
  this.tailLength = 200;
  this.tailSkip = 10;
  this.replace = true;
  this.nominalScale = 0.1;
  this.particles = [];
  this.sprites = new PIXI.ParticleContainer(0, {
    scale: true,
    position: true,
    rotation: true,
    uvs: true,
    alpha: true
  });
  container.addChild(this.sprites);
  this.counter = 0;
  this.iconTexture = null;
}

Particles.prototype.drawIcon = function(){
  var ctx = this.canvasIcon.getContext('2d');
  ctx.clearRect(0,0, 10, 10);
  ctx.strokeStyle = d3.hsl(Math.random()*360, 0.5, Math.random()*0.5 + 0.5);
  ctx.strokeWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(0, 5);
  ctx.lineTo(10, 5);
  ctx.moveTo(5,5);
  ctx.lineTo(5, 10);
  ctx.stroke();
  if (this.iconTexture) {
    this.iconTexture.update();
  }
};

Particles.prototype.create = function() {
  'use strict';
  // replace it
  var newParticle = PIXI.Sprite.fromImage(this.icon);
  // this.iconTexture = new PIXI.Texture.fromCanvas(this.canvasIcon);
  // var newParticle = new PIXI.Sprite(this.iconTexture);
  // set anchor to center
  newParticle.anchor.set(0.5);
  newParticle.alpha = this.particleAlpha;
  newParticle.x = Math.random() * this.width;
  newParticle.y = Math.random() * this.height;
  newParticle.scale.x = 0.1;
  newParticle.scale.y = -0.1;
  // keep track of a tail
  newParticle.tail = [];
  return newParticle;
};

Particles.prototype.clear = function () {
  'use strict';
  // clear particles
  this.particles = [];
  this.sprites.removeChildren();
};

Particles.prototype.culling = function (n) {
  'use strict';
  // make sure we have n particles by breeding or culling
  // also update the sprites

  var nCurrent = this.particles.length;
  var nNew = n;

  // culling
  for (var i = nCurrent - 1; i > nNew; i--) {
    _.pullAt(this.particles, i);
    this.sprites.removeChildAt(i);
  }

  // add extra particles
  for(var j = 0; j < nNew - nCurrent; j++) {
    var newParticle = this.create();
    // add to array and to particle container
    this.particles.push(newParticle);
    this.sprites.addChild(newParticle);
  }
};

Particles.prototype.draw = function () {
  var drawing = $('#drawing')[0];
  var drawingctx = drawing.getContext('2d');
  drawingctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  drawingctx.lineWidth = 3;
  if (this.particles.length < 300 ) {
    _.each(this.particles, function(particle) {
      if (particle.tail.length > 0) {
        drawingctx.beginPath();
        drawingctx.moveTo(particle.tail[0].x, particle.tail[0].y);
        for(var j = 1; j < particle.tail.length; j++) {
          drawingctx.lineTo(particle.tail[j].x, particle.tail[j].y);
        }
        drawingctx.stroke();
      }
    });
  }
};


Particles.prototype.step = function () {
  'use strict';

  // Get the velocity field (video)
  var uv = $('#uv')[0];
  if (uv.paused || uv.ended) {
    return;
  }

  //
  var uvhidden = $('#uvhidden')[0];
  var uvctx = uvhidden.getContext('2d');

  // we need to copy the video to a canvas so we can extract the data
  // and extract the u and v component
  // You can't extract pixels from video directly...
  var width = uvhidden.width,
      height = uvhidden.height;
  // copy the video frame to the 2d canvas
  uvctx.drawImage(uv, 0, 0, width, height);
  // get a typed array (1d vector)
  var frame = uvctx.getImageData(0, 0, width, height);


  _.each(this.particles, function(particle){
    // compute the 1d index based on the current position
    // *4 -> rgba
    var idx = (
      Math.round(height - particle.position.y) * width +
        Math.round(particle.position.x)
    ) * 4;
    // rescale the velocity
    var u = (frame.data[idx + 0] / 255.0) - 0.5;
    var v = (frame.data[idx + 1] / 255.0) - 0.5;
    // do we need to flip the vertical
    // TODO: use scale for this?
    v = v * (this.model.flipv ? -1 : 1);
    // Use the rgBa channel as a mask
    var mask = (frame.data[idx + 2] / 255.0) > 0.5;
    // also mask if U and V are 0.0
    // TODO: is this ever true? probably because we are using uint8
    mask = mask || (Math.abs(u) + Math.abs(v) === 0.0);
    // update the position
    particle.position.x = particle.position.x + u * this.model.scale;
    particle.position.y = particle.position.y + v * this.model.scale;
    // out of domain
    mask = mask || particle.position.x > width;
    mask = mask || particle.position.x < 0;
    mask = mask || particle.position.y > height;
    mask = mask || particle.position.y < 0;
    // if we get invalid data toss the particle away
    // TODO: how do we get nans here....?
    mask = mask || isNaN(particle.position.x);
    mask = mask || isNaN(particle.position.y);

    // TODO: proper momentum & behaviour function
    // TODO: fix circles (mod something...)


    // double raw_diff = first > second ? first - second : second - first;
    // double mod_diff = std::fmod(raw_diff, 360.0);
    // double dist = mod_diff > 180.0 ? 360.0 - mod_diff : mod_diff;
    var oldRotation = particle.rotation;
    var newRotation = Math.atan2(v, u ) - (0.5 * Math.PI);
    var rawDiff = newRotation > oldRotation ? newRotation - oldRotation : oldRotation - newRotation;
    var modDiff = rawDiff  % (Math.PI * 2.0);
    var arcDist = modDiff > Math.PI ? Math.PI * 2.0  - modDiff : modDiff;

    var maxRotation = 0.1;
    if (Math.abs(arcDist) > maxRotation) {
      // limit,
      arcDist = arcDist > 0.0 ? maxRotation : -maxRotation;
    }
    particle.rotation = newRotation;

    // replace dead particles
    if (mask) {
      // pull out of the list of particles
      _.pull(this.particles, particle);
      // and remove corresponding sprite
      this.sprites.removeChild(particle);

      // make a new one
      if (this.replace) {
        var newParticle = this.create();
        // add to array and to particle container
        this.particles.push(newParticle);
        this.sprites.addChild(newParticle);
      }

    }
    // Keep track of the tail
    if ((this.counter % this.tailSkip) === 0) {
      // add the current position to the tail (at the right)
      // clone, otherwise we have a reference
      particle.tail.push(_.clone(particle.position));
      while (particle.tail.length > this.tailLength) {
        // remove from the left
        particle.tail.shift();
      }

    }
  }, this);
  this.counter++;
};
