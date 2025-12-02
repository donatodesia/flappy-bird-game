import Phaser from 'phaser';

const config = {
  // WebGL (Web graphics library): Js Api for rendering 2D and 3D grapichs.
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { 
      // Gravity on Y makes Bird Fall. Debug Shows the green direction vector.
      gravity: { y: 400 },
      debug: true
    }
  },
  // Arcade physics plugin, manages physics simulation
  scene: {
    preload,
    create,
    update
  }
}

function preload () {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
}

const velo = 200;
let bird = null;
let toolDelta = null;
let flapVelo = 250;

function create () {
  this.add.image(400, 300, "sky");
  bird = this.physics.add.sprite(config.width /20, 300, 'bird').setOrigin(0); 
  //bird.body.velocity.x = velo;

  this.input.on('pointerdown', flap);
  this.input.keyboard.on('keydown-SPACE', flap);
}

// if bird position x is same or larger than width of canvas, 
  // go back to left.
// if else bird position x is smaller or equal to 0,
  // then move back to the right.


  /* If Bird y position is smaller than 0 or greater than height of the canvas
     Then ALERt: "You lost" */
function update(time, delta){
  if(bird.y >= config.height || bird.y <= 0){
    alert("You lost! Try Again");
  }

  // if(bird.x >= config.width) { 
  //   bird.body.velocity.x = -velo; 
  // } else if(bird.x <= 0) {
  //   bird.body.velocity.x = velo;
  // }
}
 
function again(){
 return;
}

function flap() {
  debugger
  bird.body.velocity.y = -flapVelo;
}

new Phaser.Game(config);








/*
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: {
    preload: preload,
    create: create
  }
};

new Phaser.Game(config);

function preload () {
  this.load.image('sky', 'assets/sky.png');
}

function create () {
  this.add.image(400, 300, 'sky');
  this.add.sprite(config.width /2, config.height / 2, 'bird').setOrigin(0);
}
*/
