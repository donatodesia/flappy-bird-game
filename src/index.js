import Phaser from 'phaser';

const config = {  // WebGL (Web graphics library): Js Api for rendering 2D and 3D grapichs.
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {       // Arcade physics plugin, manages physics simulation.
      debug: true   // Debug Shows the green direction vector.
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

function preload () {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

const velo = 200;
let bird = null;
let upperPipe = null;
let lowerPipe = null;
let toolDelta = null;
let flapVelo = 250;
const initialBirdPosition = {x: config.width / 7.5, y: config.height / 2};
let pipePosition = {x: null, y: null}
const pipeGapRange = [150, 250];
let pipeGap = Phaser.Math.Between(...pipeGapRange);

function create () {
  this.add.image(400, 300, "sky");
  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0); 
  bird.body.gravity.y = 400;
  upperPipe = this.physics.add.sprite(pipePosition.x = config.width -500, pipePosition.y = config.height - 850, 'pipe').setOrigin(0);
  lowerPipe = this.physics.add.sprite(pipePosition.x = config.width -500, pipePosition.y = config.height - 250, 'pipe').setOrigin(0);

  
  this.input.on('pointerdown', flap);
  this.input.keyboard.on('keydown-SPACE', flap);
}

function createPipe() {
}

// if bird position x is same or larger than width of canvas, go back to left.
// if else bird position x is smaller or equal to 0, then move back to the right.
  // if(bird.x >= config.width) { 
  //   bird.body.velocity.x = -velo; }
  // else if(bird.x <= 0) {
  //   bird.body.velocity.x = velo; }

/* If Bird y position is smaller than 0 or greater than height of the canvas
   Then ALERt: "You lost" */

function update(time, delta){  // "- bird.height" doesn´t work
  if(bird.y >= config.height || bird.y <= 0 - bird.height){
  //  alert("You lost! Try Again");
    restart();
  }

}
 
function restart(){
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
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
