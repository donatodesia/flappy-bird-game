import Phaser from "phaser";

class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
        this.bird = null;
        this.flapVelo = 250;
        this.pipesGroup = null;
        this.pipePairs = [];
        this.velo = 300;
        this.score = 0;
        this.scoreText = "";
        this.bestScoreText = null;
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
        this.handlePause();

        // Fly Animation

        this.anims.create({
            key: 'fly',                 // Frame of 16x16 plays from #8 to #15 
            frames: this.anims.generateFrameNumbers('bird', { start: 8, end: 15 }),
            frameRate: 16,   // 24 fps default, it will play animation consisting of 24 frames in 1 second. That means 8x3 times in 1 sec
            repeat: -1      // Repeat -1 means infinite times    
        });
        this.bird.play('fly');

        // Resuming Game - Can be optimized
        this.events.on('resume', () => {
            this.isPaused = false;
        });
    }

    update() {
        this.pipesUpdate();
        this.birdStatus();
    }

    // SPRITE CREATION

    createSky() {
        //Sky
        this.add.image(this.scale.width * 0.5, this.scale.height * 0.5, "sky")
            .setDisplaySize(this.scale.width, this.scale.height);
    }

    createBird() {
        //Bird Initial Position
        const birdX = this.scale.width / 15;
        const birdY = this.scale.height / 2;
        this.bird = this.physics.add.sprite(birdX, birdY, 'bird')
            .setFlipX(true)
            .setScale(2.5)
            .setOrigin(0);

        this.bird.setBodySize(this.bird.width * 0.90, this.bird.height * 0.55);
        this.bird.body.gravity.y = 400;
        this.bird.setCollideWorldBounds(true);
    }

    createPipes() { // Pipes could be added Difficulty
        //Pipes               
        this.pipesGroup = this.physics.add.group();
        let distanceX = 0;
        for (let i = 1; i <= 4; i++) {
            // Pipes Horizontal Distance
            distanceX = i * Phaser.Math.Between(576, 640);
            // Pipes Vertical Positions
            let upperPipeY = Phaser.Math.Between(110, 380);  // Original: (100, 400)
            let lowerPipeY = Phaser.Math.Between(180, 280); // Original: (120, 180)
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

    // PIPES STATUS

    pipesUpdate() {
        this.pipePairs.forEach(pair => {
            if (pair.uPipe.x < -60) {
                let lastX = Math.max(...this.pipePairs.map(p => p.uPipe.x));   // Find farthest Pipes
                let newX = lastX + Phaser.Math.Between(576, 640);
                let newY = Phaser.Math.Between(110, 380);
                let gap = Phaser.Math.Between(180, 280);
                pair.uPipe.x = newX;
                pair.uPipe.y = newY;
                pair.lPipe.x = newX;
                pair.lPipe.y = newY + gap;
                this.increaseScore();
                this.saveBestScore();
            }
        })
    }

    // BIRD STATUS

    birdStatus() {
        if (this.bird.getBounds().bottom >= this.scale.height || this.bird.getBounds().top <= 0) {
            this.birdRestart();
        }
    }

    birdRestart() {

        // GAMEOVER
        this.physics.pause();
        this.bird.setTint(0xff0000);

        // debugger
        this.saveBestScore();

        // GameOver Delay
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

        this.input.keyboard.on('keydown-ESC', () => {
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
    }

    handleInputs() {
        //Flap
        if (!this.isPaused) {
            this.input.on('pointerdown', this.flap, this);
            this.input.keyboard.on('keydown-SPACE', this.flap, this);
        }
    }

    // SCORE

    createScore() {
        const paddingX = this.scale.width * 0.019;
        const paddingY = this.scale.height * 0.025;
        const lineSpacing = this.scale.height * 0.040;
        // debugger

        // Dont know why it works now but not by: const bestScore = localStorage...
        // Still Giving Problems.

        let bestScore = 0;
        bestScore = localStorage.getItem("bestScore");

        // const fontSize = Math.round(this.scale.height * 0.035); 
        let textStyle = null;

        this.scoreText = this.add.text(paddingX, paddingY, 'Score: ' + this.score,
            textStyle = {
                fontSize: `${25}px`,
                fontFamily: 'Arial',
                fill: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 3,
            });
        this.add.text(paddingX, paddingY + lineSpacing, `Best Score: ${bestScore || 0} `,
            textStyle = {
                fontSize: `${15}px`,
                fontFamily: 'Arial',
                fill: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 3,
            });
    }

    saveBestScore() {
        // Saving Best Score
        const bestScoreText = localStorage.getItem("bestScore");
        if (bestScoreText) {
            this.registry.set("bestScore", parseInt(bestScoreText));
        }

        if (!bestScoreText || this.score > bestScoreText) {
            localStorage.setItem('bestScore', this.score);
        }
        else if (bestScoreText) {
            this.registry.set("bestScore", parseInt(bestScoreText));
        }
    }

    increaseScore() {
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
    }
}

export default PlayScene;