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
        [
            'precision mediump float;',
            'varying vec2 vMapCoord;',
            'varying vec2 vTextureCoord;',
            'varying vec4 vColor;',
            'uniform vec2 scale;',
            'uniform bool flipv;',
            'uniform sampler2D uSampler;',
            'uniform sampler2D mapSampler;',
            'void main(void)',
            '{',
            'vec4 map =  texture2D(mapSampler, vMapCoord);',
            'map -= 0.5;',
            'map.xy *= scale;',
            'if (flipv) {',
            'map.y = 1.0 - map.y;',
            '}',
            '/* stop rendering if masked */',
            'gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y));',
            'if (map.z > 0.0) {',
            'gl_FragColor *= 0.0;',
            '}',
            '}'
        ].join('\n'),

        // uniforms
        {
            mapSampler: { type: 'sampler2D', value: sprite.texture },
            otherMatrix: { type: 'mat3', value: maskMatrix.toArray(true) },
            scale: { type: 'v2', value: { x: 1, y: 1 } },
            flipv: { type: 'bool', value: false }
        }
    );

    this.maskSprite = sprite;
    this.maskMatrix = maskMatrix;

    var scale = _.get(settings, 'scale', 20);
    this.scale = new PIXI.Point(scale, scale);

    var flipv = _.get(settings, 'flipv', false);
    this.flipv = flipv;
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
    // apply vertical flip
    this.uniforms.flipv.value = this.flipv;

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
