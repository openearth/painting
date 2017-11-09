/* exported AdvectionFilter */
/*eslint-disable no-unused-vars*/
var AdvectionFilter;
/*eslint-enable no-unused-vars*/

(function () {
  'use strict';

  // global variables


  var vertexSource = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat3 projectionMatrix;
uniform mat3 filterMatrix;
varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

void main(void)
{
   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
   vFilterCoord = ( filterMatrix * vec3( aTextureCoord, 1.0)  ).xy;
   vTextureCoord = aTextureCoord;
}
`;

  var fragmentSource = `
varying vec2 vFilterCoord;
varying vec2 vTextureCoord;
uniform float decay;
uniform vec2 scale;
uniform bool flipv;
uniform sampler2D uUVSampler;
uniform sampler2D uSampler;

bool isNaN(float val)
{
  return (val <= 0.0 || 0.0 <= val) ? false : true;
}

void main(void)
{
  // lookup in 0-1 space
  vec2 coord = vFilterCoord;
  // invert y if flipping
  if (flipv) {
    coord.y = 1.0 - coord.y;
  }

  vec4 map =  texture2D(uUVSampler, coord);
  map -= 0.5;
  map.xy *= scale;
  // recompute scale if flipped
  if (flipv) {
    map.y = - map.y;
  }



  vec2 lookup = vec2(vTextureCoord.x - map.x, vTextureCoord.y - map.y);


  vec4 color = texture2D(uSampler, lookup);
  // I expected that I would have to apply this to the .a only..
  color = vec4(color.rgb * decay, color.a * decay);
  gl_FragColor = color;
  if (map.z > 0.0) {
    gl_FragColor *= 0.0;
  }
}`;


  AdvectionFilter = class AdvectionFilter2 extends PIXI.Filter
  {
    /**
     * @param {PIXI.Sprite} sprite - The sprite used for the displacement map. (make sure its added to the scene!)
     * @param {number} scale - The scale of the displacement
     */
    constructor(sprite, settings)
    {
      const maskMatrix = new PIXI.Matrix();
      sprite.renderable = false;
      super(
        // vertex shader
        vertexSource,
        // fragment shader
        fragmentSource
      );
      this.maskSprite = sprite;

      this.maskMatrix = maskMatrix;

      this.uniforms.uUVSampler = sprite.texture;
      this.uniforms.filterMatrix = maskMatrix.toArray(true);

      var scale = _.get(settings, 'scale', 10.0);
      this.scale = new PIXI.Point(scale, scale);
      var flipv = _.get(settings, 'flipv', false);
      this.flipv = flipv;
      var decay = _.get(settings, 'decay', 1.0);
      this.decay = decay;
    }
    /**
     * Applies the filter.
     *
     * @param {PIXI.FilterManager} filterManager - The manager.
     * @param {PIXI.RenderTarget} input - The input target.
     * @param {PIXI.RenderTarget} output - The output target.
     */
    apply(filterManager, input, output)
    {
      const ratio = (1 / output.destinationFrame.width) * (output.size.width / input.size.width);
      this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, this.maskSprite);
      this.uniforms.scale.x = this.scale.x * ratio;
      this.uniforms.scale.y = this.scale.y * ratio;
      // // apply vertical flip
      this.uniforms.flipv = this.flipv;
      // this.uniforms.upwind.value = this.upwind;
      this.uniforms.decay = this.decay;

      // draw the filter...
      filterManager.applyFilter(this, input, output);
    }
    /**
     * The texture used for the displacement map. Must be power of 2 sized texture.
     *
     * @member {PIXI.Texture}
     * @memberof PIXI.filters.DisplacementFilter#
     */
    get map()
    {
      return this.uniforms.uUVSampler;
    }
    /**
     * Sets the texture to use for the displacement.
     *
     * @param {PIXI.Texture} value - The texture to set to.
     */
    set map(value)
    {
      this.uniforms.uUVSampler = value;
    }
  };

}());
