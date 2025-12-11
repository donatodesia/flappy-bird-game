import Phaser from 'phaser';

const config = {  // WebGL (Web graphics library): Js Api for rendering 2D and 3D grapichs.
  type: Phaser.AUTO,
  width: 1800,
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
let toolDelta = null;
let flapVelo = 250;
const initialBirdPosition = {x: config.width / 7.5, y: config.height / 2};

let pipesGroup = null;
let pipePairs = [];

// Render Sprites:
function create () {

  //Sky
  this.add.image(400, 300, "sky");

  //Bird
  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0); 
  bird.body.gravity.y = 400;

  //Flap
  this.input.on('pointerdown', flap);
  this.input.keyboard.on('keydown-SPACE', flap);

  //Pipes
  pipesGroup = this.physics.add.group();
  let distanceX = 0;
  for(let i = 1; i <= 4; i++){   
    // Pipes Horizontal Distance
    distanceX = i * Phaser.Math.Between(300, 400);
    console.log(distanceX);
    // Pipes Vertical Positions
    let upperPipeY = Phaser.Math.Between(100, 400);
    let lowerPipeY = Phaser.Math.Between(70, 200);
    // Spawn Pipes
    let upperPipe = pipesGroup.create(distanceX, upperPipeY, 'pipe').setOrigin(0, 1);
    let lowerPipe = pipesGroup.create(distanceX, upperPipeY + lowerPipeY, 'pipe').setOrigin(0, 0);
    // Save Pair
    let pair = {
      uPipe: upperPipe,
      lPipe: lowerPipe
    };
    pipePairs.push(pair);
    console.log(pipePairs[0].uPipe);
  }
  // Move all Pipes at once
  pipesGroup.setVelocityX(-velo);

  //Don´t know yet
    // // Colisión bird <-> pipes (opcional, ajusta)
    // this.physics.add.collider(this.bird, this.pipesGroup, this.hitPipe, null, this);

    // // Opcional: límites mundo para bird
    // this.bird.body.collideWorldBounds = true;
}

function update(time, delta){ 
  // Update Pipes
  pipePairs.forEach(pair => {
    if(pair.uPipe.x < 0){ 
      let farX = Math.max(...pipePairs.map(p => p.uPipe.x)); // Find farthest Pipes
      let newX = farX + Phaser.Math.Between(300, 400);       // Assign Pipes new position
      let newY = Phaser.Math.Between(100, 400);
      let gap = Phaser.Math.Between(70, 200);
      pair.uPipe.x = newX;
      pair.uPipe.y = newY;
      pair.lPipe.x = newX;
      pair.lPipe.y = newY + gap;
      // console.log(pair.lPipe.y);
    }
  })

  // Update Bird
  if(bird.y >= config.height - bird.height || bird.y <= - bird.height + 20){
  // alert("You lost! Try Again");
  restart();
  }
}

function restart(){
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}


function flap() {
  debugger
  bird.body.velocity.y = -flapVelo;
}

new Phaser.Game(config);