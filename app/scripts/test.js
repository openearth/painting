// PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

// create an new instance of a pixi stage
var stage = new PIXI.Container();

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(9, 9);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);
console.log(renderer);

var container = new PIXI.Container();
stage.addChild(container);

// create a texture from an image path
var texture = PIXI.Texture.fromImage("images/pixel.png");
console.log(texture);

// create a new Sprite using the texture
var bunny = new PIXI.Sprite(texture);

// center the sprites anchor point
bunny.anchor.x = 0;
bunny.anchor.y = 0;

// move the sprite t the center of the screen
bunny.position.x = 0;
bunny.position.y = 0;

container.addChild(bunny);

var displacementSprite = PIXI.Sprite.fromImage('images/displace.png');
var displacementFilter = new AdvectionFilter(displacementSprite, {
    scale: 1.0,
    flipv: false,
    upwind: false
}
);

//stage.addChild(displacementSprite);

container.filters = [displacementFilter];

var s = 1.0;
displacementFilter.scale.x = s * 2;
displacementFilter.scale.y = s * 2;

requestAnimationFrame( animate );

function animate() {

  // just for fun, lets rotate mr rabbit a little
  //bunny.rotation += 0.1;
  //bunny.position.x -= 1;

  // render the stage
  renderer.render(stage);

  requestAnimationFrame( animate );

}
