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
    //'uniform float fade;',
    'uniform sampler2D uSampler;',
    'uniform sampler2D mapSampler;',
    'void main(void)',
    '{',
    '  // lookup in 0-1 space',
    '  vec2 onePixel = vec2(0.5, 0.5) * scale;',

  //'vec4 map =  texture2D(mapSampler, vMapCoord);',
  //'float extrascale = 1.0;',
  //'map -= 0.5;',
  //'map.xy *= (scale * extrascale);',
  //'if (flipv) {',
  //'map.y = - map.y;',
  //'}',
  //'vec2 lookup = vec2(vTextureCoord.x - map.x, vTextureCoord.y - map.y);',
  //'/* stop rendering if masked */',
  //'gl_FragColor = texture2D(uSampler, lookup);',
  //'if (map.z > 0.0) {',
  //'gl_FragColor *= 0.0;',
  //'}',
    
    '  // locations',
    '  vec2 tMe = vec2(vTextureCoord.x, vTextureCoord.y);', // lookup
    '  vec2 tLeft = vec2(tMe.x - onePixel.x, tMe.y);',
    '  vec2 tRight = vec2(tMe.x + onePixel.x, tMe.y);',
    '  vec2 tTop = vec2(tMe.x, tMe.y - onePixel.y);',
    '  vec2 tBottom = vec2(tMe.x, tMe.y + onePixel.y);',
    
    '  // colors',
    '  vec4 cMe = texture2D(uSampler, tMe);', // gl_FragColor
    '  vec4 cLeft = texture2D(uSampler, tLeft);',
    '  vec4 cRight = texture2D(uSampler, tRight);',
    '  vec4 cTop = texture2D(uSampler, tTop);',
    '  vec4 cBottom = texture2D(uSampler, tBottom);',

    '  // locations',
    '  vec2 mMe = vec2(vMapCoord.x, vMapCoord.y);',
    '  vec2 mLeft = vec2(mMe.x - onePixel.x, mMe.y);',
    '  vec2 mRight = vec2(mMe.x + onePixel.x, mMe.y);',
    '  vec2 mTop = vec2(mMe.x, mMe.y - onePixel.y);',
    '  vec2 mBottom = vec2(mMe.x, mMe.y + onePixel.y);',

    '  // velocities',
    '  float extrascale = 0.5;',
    '  vec4 uMe = texture2D(mapSampler, mMe);', // map
    '  float uMe_x = abs(uMe.x - 0.5) * 2.0 * extrascale;',
    '  float uMe_y = abs(uMe.y - 0.5) * 2.0 * extrascale;',
    '  float uMe_z = uMe.z - 0.5;',
    '  float uLeft = (texture2D(mapSampler, mLeft).x - 0.5) * 2.0 * extrascale;',
    '  float uRight = (texture2D(mapSampler, mRight).x - 0.5) * 2.0 * extrascale;',
    '  float uTop = (texture2D(mapSampler, mTop).y - 0.5) * 2.0 * extrascale;',
    '  float uBottom = (texture2D(mapSampler, mBottom).y - 0.5) * 2.0 * extrascale;',

    '  if (flipv) {',
    '    uTop = -uTop;',
    '    uBottom = -uBottom;',
    '  }',

    '  // new color',
    '  float fade = 0.99;', 
    '  vec4 colorSum = ',
    '    cMe * fade ',
    '    - cMe * uMe_x ',
    '    - cMe * uMe_y ',
    '    - cLeft * min(0.0, uLeft) ',
    '    + cRight * max(0.0, uRight) ',
    '    - cTop * min(0.0, uTop) ',
    '    + cBottom * max(0.0, uBottom) ',
    '  ;',

    '  // mask',
    '  gl_FragColor = colorSum;',
    '  if (uMe_z > 0.0) {',
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
      fade: { type: 'float', value: settings.fade }
    }
  );

  this.maskSprite = sprite;
  this.maskMatrix = maskMatrix;

  var scale = _.get(settings, 'scale', 10.0);
  this.scale = new PIXI.Point(scale, scale);
  var flipv = _.get(settings, 'flipv', false);
  this.flipv = flipv;
  console.log('flip in advection', this.flipv, flipv, this);

  var fade = _.get(settings, 'fade', 1.00);
  this.fade = fade;
  console.log('fade in advection', this.fade, fade, this);

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

  this.uniforms.flipv.value = this.flipv;
  this.uniforms.fade.value = this.fade;

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
