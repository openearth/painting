/* exported AdvectionFilter */
/**
 * The AdvectionFilter class uses the pixel values from the specified texture (called the displacement map) to perform a displacement of an object.
 * You can use this filter to to move stuff around
 * Currently the r property of the texture is used to offset the x and the g property of the texture is used to offset the y.
 * The b property is used to mask the advection (b > 0.5 is not advected)
 *
 * @class
 * @extends PIXI.AbstractFilter
 * @memberof PIXI.filters
 * @param sprite {PIXI.Sprite} the sprite used for the displacement map. (make sure its added to the scene!)
 */

'use strict';

var fragmentSource = [
    'precision mediump float;',
    'varying vec2 vMapCoord;',
    'varying vec2 vTextureCoord;',
    'uniform vec2 scale;',
    'uniform bool flipv;',
    'uniform sampler2D uSampler;',
    'uniform sampler2D mapSampler;',
    'void main(void)',
    '{',
    '  // lookup in 0-1 space',
    '  vec2 onePixel = vec2(1.0, 1.0) * scale;',
    
    '  // locations',
    '  vec2 me = vTextureCoord;',
    '  vec2 top = vec2(vTextureCoord.x, vTextureCoord.y - onePixel.y);',
    '  vec2 bottom = vec2(vTextureCoord.x, vTextureCoord.y + onePixel.y);',
    '  vec2 left = vec2(vTextureCoord.x - onePixel.x, vTextureCoord.y);',
    '  vec2 right = vec2(vTextureCoord.x + onePixel.x, vTextureCoord.y);',

    '  // colors',
    '  vec4 cMe = texture2D(uSampler, me);',
    '  vec4 cTop = texture2D(uSampler, top);',
    '  vec4 cBottom = texture2D(uSampler, bottom);',
    '  vec4 cLeft = texture2D(uSampler, left);',
    '  vec4 cRight = texture2D(uSampler, right);',

    '  // velocities',
    '  float extrascale = 1.0;',
    '  float fade = 1.0;',
    '  float uMe_x = abs(texture2D(mapSampler, me).x - 0.5) * 2.0 * extrascale * fade;',
    '  float uMe_y = abs(texture2D(mapSampler, me).y - 0.5) * 2.0 * extrascale * fade;',
    '  float uTop = (texture2D(mapSampler, top).y - 0.5) * 2.0 * extrascale;',
    '  float uBottom = (texture2D(mapSampler, bottom).y - 0.5) * 2.0 * extrascale;',
    '  float uLeft = (texture2D(mapSampler, left).x - 0.5) * 2.0 * extrascale;',
    '  float uRight = (texture2D(mapSampler, right).x - 0.5) * 2.0 * extrascale;',

    '  if (flipv) {',
    '    uTop = -uTop;',
    '    uBottom = -uBottom;',
    '  }',

    '  // new color',
    '  vec4 colorSum = ',
    '    cMe ',
    '    - cMe * uMe_x ',
    '    - cMe * uMe_y ',
    '    + cTop * max(0.0, uTop) ',
    '    - cBottom * min(0.0, uBottom) ',
    '    + cLeft * max(0.0, uLeft) ',
    '    - cRight * min(0.0, uRight) ',
    '  ;',

    '  // mask',
    '  gl_FragColor = colorSum;',
    '  if (cMe.z > 0.0) {',
    '    gl_FragColor *= 0.0;',
    '  }',
    '}',
].join('\n');

function AdvectionFilter(sprite, settings)
{
  var maskMatrix = new PIXI.Matrix();
  sprite.renderable = false;

  PIXI.AbstractFilter.call(
    this,
    // inject the fragment shaders using fs and require
    // vertex shader
    [
      'attribute vec2 aVertexPosition;',
      'attribute vec2 aTextureCoord;',
      'attribute vec4 aColor;',
      'uniform mat3 projectionMatrix;',
      'uniform mat3 otherMatrix;',
      'varying vec2 vMapCoord;',
      'varying vec2 vTextureCoord;',
      'varying vec4 vColor;',
      'void main(void)',
      '{',
      'gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);',
      'vTextureCoord = aTextureCoord;',
      'vMapCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;',
      'vColor = vec4(aColor.rgb * aColor.a, aColor.a);',
      '}'
    ].join('\n'),
    fragmentSource,
      
    // uniforms
    {
      mapSampler: { type: 'sampler2D', value: sprite.texture },
      otherMatrix: { type: 'mat3', value: maskMatrix.toArray(true) },
      scale: { type: 'v2', value: { x: 0, y: 0 } },
      flipv: { type: 'bool', value: settings.flipv },
      upwind: { type: 'bool', value: settings.upwind}
    }
  );

  this.maskSprite = sprite;
  this.maskMatrix = maskMatrix;

  var scale = _.get(settings, 'scale', 10.0);
  this.scale = new PIXI.Point(scale, scale);
  console.log('scale in advection', this.scale, scale, this);

  var flipv = _.get(settings, 'flipv', false);
  this.flipv = flipv;

  // var upwind = _.get(settings, 'upwind', false);
  // this.upwind = upwind;

}

AdvectionFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);
AdvectionFilter.prototype.constructor = AdvectionFilter;

AdvectionFilter.prototype.applyFilter = function (renderer, input, output)
{
  var filterManager = renderer.filterManager;

  filterManager.calculateMappedMatrix(input.frame, this.maskSprite, this.maskMatrix);

  this.uniforms.otherMatrix.value = this.maskMatrix.toArray(true);
  this.uniforms.scale.value.x = this.scale.x * (1 / input.frame.width);
  this.uniforms.scale.value.y = this.scale.y * (1 / input.frame.height);
  // // apply vertical flip
  this.uniforms.flipv.value = this.flipv;
  // this.uniforms.upwind.value = this.upwind;

  var shader = this.getShader(renderer);
  // draw the filter...
  filterManager.applyFilter(shader, input, output);
};


Object.defineProperties(AdvectionFilter.prototype, {
  /**
   * The texture used for the advection map. Must be power of 2 sized texture.
   *
   * @member {PIXI.Texture}
   * @memberof PIXI.filters.AdvectionFilter#
   */
  map: {
    get: function ()
    {
      return this.uniforms.mapSampler.value;
    },
    set: function (value)
    {
      this.uniforms.mapSampler.value = value;

    }
  }
});
