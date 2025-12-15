import Phaser from "phaser";

class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
        this.bird = null;
        this.pipesGroup = null;
        this.pipePairs = [];
        this.flapVelo = 250;
        this.velo = 200;

        this.score = 0;
        this.scoreText = "";
    }


    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('bird', 'assets/bird.png');
        this.load.image('pipe', 'assets/pipe.png');
    }

    create() {
        this.createSky();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.handleInputs();
    }

    update() {
        this.pipesUpdate();
        this.birdStatus();
    }

    createSky() {
        //Sky
        this.add.image(400, 300, "sky");
        // this.add.image(this.scale.width / 2, this.scale.height / 2, 'sky')
        //     .setDisplaySize(this.scale.width, this.scale.height);  // Scale sky on whole Screen
    }

    createBird() {
        //Bird Initial Position
        const birdX = this.scale.width / 20;
        const birdY = this.scale.height / 2;
        this.bird = this.physics.add.sprite(birdX, birdY, 'bird').setOrigin(0);
        this.bird.body.gravity.y = 400;
        this.bird.setCollideWorldBounds(true);
    }

    createPipes() {            // Pipes Generation needs fixation on distance an gap
        //Pipes               
        this.pipesGroup = this.physics.add.group();
        let distanceX = 0;
        for (let i = 1; i <= 4; i++) {
            // Pipes Horizontal Distance
            distanceX = i * Phaser.Math.Between(450, 500);
            // Pipes Vertical Positions
            let upperPipeY = Phaser.Math.Between(100, 400);
            let lowerPipeY = Phaser.Math.Between(120, 200);
            // Spawn Pipes
            let upperPipe = this.pipesGroup.create(distanceX, upperPipeY, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 1);
            let lowerPipe = this.pipesGroup.create(distanceX, upperPipeY + lowerPipeY, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 0);
            // Save Pair
            let pair = {
                uPipe: upperPipe,
                lPipe: lowerPipe
            };
            this.pipePairs.push(pair);
            this.pipePairs.gravity = false;
        }
        // Move all Pipes at once
        this.pipesGroup.setVelocityX(-this.velo);
    }

    createColliders() {
        this.physics.add.collider(this.bird, this.pipesGroup, this.birdRestart, null, this);
    }

    handleInputs() {
        //Flap
        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown-SPACE', this.flap, this);
    }

    pipesUpdate() {
        this.pipePairs.forEach(pair => {
            if (pair.uPipe.x < -60) {
                let lastX = Math.max(...this.pipePairs.map(p => p.uPipe.x));   // Find farthest Pipes
                let newX = lastX + Phaser.Math.Between(300, 400);              // Assign Pipes new position
                let newY = Phaser.Math.Between(100, 400);
                let gap = Phaser.Math.Between(70, 200);
                pair.uPipe.x = newX;
                pair.uPipe.y = newY;
                pair.lPipe.x = newX;
                pair.lPipe.y = newY + gap;
                this.increaseScore();

            }
        })
    }

    birdStatus() {
        if (this.bird.getBounds().bottom >= this.scale.height || this.bird.getBounds().top <= 0) {
            // alert("You lost! Try Again");
            this.birdRestart();
        }
    }

    birdRestart() {
        this.physics.pause();

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.score = 0;
                this.scene.restart();
            },
            loop: false
        })
    }

    flap() {
        debugger
        this.bird.body.velocity.y = -this.flapVelo;
    }

    createScore() {
        this.scoreText = this.add.text(15, 15, 'Score: ' + this.score);
    }

    increaseScore() {
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
    }
}

export default PlayScene;