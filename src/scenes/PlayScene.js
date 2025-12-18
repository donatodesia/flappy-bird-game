import Phaser from "phaser";

class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
        this.bird = null;      
        this.flapVelo = 250;
        this.pipesGroup = null;
        this.pipePairs = [];
        this.velo = 200;
        this.score = 0;
        this.scoreText = "";
        this.pauseButton = null;
        this.isPaused = false;
    }

    create() {
        this.createSky();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.createPauseBTT();
        this.handleInputs();
        this.events.on('resume', () => {
            this.isPaused = false;
            console.log("PlayScene Resumed, isPaused = false");
        });
    }

    update() {
        this.pipesUpdate();
        this.birdStatus();
        this.handlePause();
    }

    // SPRITE CREATION

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

    createPipes() {  // Pipes Generation needs fixation on distance an gap
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
            // console.log(`Pipe #${i} - \nUpper Top: ${upperPipe.body.top} - \nUpper Bottom: ${upperPipe.body.bottom}`)
            let lowerPipe = this.pipesGroup.create(distanceX, upperPipeY + lowerPipeY, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 0);
            // console.log(`Lower Top: ${lowerPipe.body.top} - Lower Bottom: ${lowerPipe.body.bottom}`)

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

    // PIPES STATUS

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


    // BIRD STATUS

    birdStatus() {
        if (this.bird.getBounds().bottom >= this.scale.height || this.bird.getBounds().top <= 0) {
            this.birdRestart();
        }
    }

    birdRestart() {             // GAMEOVER
        this.physics.pause();

        const bestScoreText = localStorage.getItem("bestScore");
        if (bestScoreText) {
            this.registry.set("bestScore", parseInt(bestScoreText));
        }

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.score = 0;
                this.scene.start('GameOver');
            },
            loop: false
        })
    }

    // PAUSE

    createPauseBTT() {
        //Pause Button
        this.pauseButton = this.add.sprite(this.scale.width * 0.95, this.scale.height * 0.05, "pauseButton")
            .setDisplaySize(this.scale.width * 0.05, this.scale.height * 0.06)
            .setInteractive({ cursor: 'pointer' });
    }

    handlePause() {
        // Clicking Pause
        this.pauseButton.on('pointerdown', (pointer, localX, localY, event) => {
            event.stopPropagation();
            this.scene.launch('PauseScene');
            this.scene.pause();
            this.isPaused = true;
        }, this);

        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.launch('PauseScene');
            this.scene.pause();
            this.isPaused = true;
        });

        // Hover Pause
        this.pauseButton.on('pointerover', () => {
            this.pauseButton.setTint(0xaaaaaa);
        });
        this.pauseButton.on('pointerout', () => {
            this.pauseButton.clearTint();
        });
    }

    // INPUTS
    
    createColliders() {
        this.physics.add.collider(this.bird, this.pipesGroup, this.birdRestart, null, this);
    }

    flap() {
        // debugger
        this.bird.body.velocity.y = -this.flapVelo;
        console.log(this.isPaused);
    }

    handleInputs() {
        //Flap
        if(!this.isPaused){
        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown-SPACE', this.flap, this);
        }
    }


    // SCORE

    createScore() {         //Fix Score Positioning
        this.scoreText = this.add.text(15, 15, 'Score: ' + this.score);
        this.bestScoreText = this.add.text(15, 30, 'Best Score: ' + 'XXX');

    }

    increaseScore() {
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
    }
}

export default PlayScene;