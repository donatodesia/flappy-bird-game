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
        this.add.image(this.scale.width * 0.5, this.scale.height * 0.5, "sky")
            .setDisplaySize(this.scale.width, this.scale.height);
    }

    createBird() {
        //Bird Initial Position
        const birdX = this.scale.width / 30;
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
            let upperPipeY = Phaser.Math.Between(80, 380);  // Original: (100, 400)
            let lowerPipeY = Phaser.Math.Between(140, 220); // Original: (120, 180)
            // Spawn Pipes
            let upperPipe = this.pipesGroup.create(distanceX, upperPipeY, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 1);
            console.log(`Pipe #${i} - \nUpper Top: ${upperPipe.body.top} - \nUpper Bottom: ${upperPipe.body.bottom}`)
            let lowerPipe = this.pipesGroup.create(distanceX, upperPipeY + lowerPipeY, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 0);
            console.log(`Lower Top: ${lowerPipe.body.top} - Lower Bottom: ${lowerPipe.body.bottom}`)

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
            this.birdRestart();
        }
    }

    birdRestart() {
        this.physics.pause();

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.score = 0;
                this.scene.start('GameOver');
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