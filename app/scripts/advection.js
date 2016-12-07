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
  'varying vec4 vColor;',
  'uniform float decay;',
  'uniform vec2 scale;',
  'uniform bool flipv;',
  'uniform bool upwind;',
  // previous image
  'uniform sampler2D uPreviousImageSampler;',
  // uv field
  'uniform sampler2D uUVSampler;',
  'void main(void)',
  '{',
  // lookup in 0-1 space
  'vec4 map =  texture2D(uUVSampler, vMapCoord);',
  'float extrascale = 1.0;',
  'map -= 0.5;',
  'map.xy *= (scale * extrascale);',
  'if (flipv) {',
  'map.y = - map.y;',
  '}',
  'vec2 lookup = vec2(vTextureCoord.x - map.x, vTextureCoord.y - map.y);',
  'if (upwind) {',
  ' vec4 vUpwind = texture2D(uUVSampler, vec2(vMapCoord.x - map.x, vMapCoord.y - map.y ));',
  ' vUpwind -= 0.5;',
  ' if (flipv) {',
  '  vUpwind.y = - vUpwind.y;',
  ' }',
  ' vUpwind.xy *= scale * extrascale;',
  ' /* overwrite lookup with upwind */',
  ' lookup = vec2(vTextureCoord.x - 0.5*(map.x + vUpwind.x), vTextureCoord.y - 0.5* (map.y + vUpwind.y));',
  '}',
  '/* stop rendering if masked */',
  'vec4 color = texture2D(uPreviousImageSampler, lookup);',
  // I expected that I would have to apply this to the .a only....
  'color = vec4(color.rgb * decay, color.a * decay); ',
  'gl_FragColor = color;',
  'if (map.z > 0.0) {',
  'gl_FragColor *= 0.0;',
  '}',
  '}'
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
      uUVSampler: { type: 'sampler2D', value: sprite.texture },
      otherMatrix: { type: 'mat3', value: maskMatrix.toArray(true) },
      scale: { type: 'v2', value: { x: 0, y: 0 } },
      flipv: { type: 'bool', value: settings.flipv },
      upwind: { type: 'bool', value: settings.upwind },
      decay: { type: '1f', value: settings.decay }
    }
  );

  this.maskSprite = sprite;
  this.maskMatrix = maskMatrix;

  var scale = _.get(settings, 'scale', 10.0);
  this.scale = new PIXI.Point(scale, scale);
  var flipv = _.get(settings, 'flipv', false);
  this.flipv = flipv;
  var decay = _.get(settings, 'decay', 1.0);
  this.decay = decay;

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
  this.uniforms.decay.value = this.decay;

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
      return this.uniforms.uUVSampler.value;
    },
    set: function (value)
    {
      this.uniforms.uUVSampler.value = value;

    }
  }
});
