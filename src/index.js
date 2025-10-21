import Phaser from 'phaser';
const config = {
  // WebGL (Web graphics library): Js Api for rendering 2D and 3D grapichs.
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { 
      gravity: { 
        x: 2
       }
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
  this.load.image("bird", "assets/birdSprite.png");
}

const velo = 200;
let bird = null;

function create () {
  this.add.image(400, 300, "sky");
  bird = this.physics.add.sprite(config.width /20, 300, 'bird').setOrigin(0); 
  bird.body.velocity.x = velo;
}

// if bird position x is same or larger than width of canvas, 
  // go back to left.
// if else bird position x is smaller or equal to 0,
  // then move back to the right.

function update(time, delta){
  if(bird.x >= config.width) { 
    bird.body.velocity.x = -velo; 
  } else if(bird.x <= 0) {
    bird.body.velocity.x = velo;
  }
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
