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
        this.handlePause();

        // Resuming Game - Can be optimized
        this.events.on('resume', () => {
            this.isPaused = false;
            console.log("PlayScene Resumed, isPaused = false");
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
                let newX = lastX + Phaser.Math.Between(576, 640);              // Assign Pipes new position
                let newY = Phaser.Math.Between(110, 380);
                let gap = Phaser.Math.Between(180, 280);
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

    createScore() {         //Fix Score Positioning
        // Posiciones relativas (basadas en % original: x~1.9%, y1~2.5%, y2~5%)
        const paddingX = this.scale.width * 0.019;   // ~15/800 → 19px en 1024
        const paddingY = this.scale.height * 0.025;  // ~15/600 → 19px en 768
        const lineSpacing = this.scale.height * 0.040; // Espaciado dinámico (~15px)

        const fontSize = Math.round(this.scale.height * 0.035);  // ~27px en 768 (escalado de ~32px original)
        let textStyle = null;

        this.scoreText = this.add.text(paddingX, paddingY, 'Score: ' + this.score,
            textStyle = {
                fontSize: `${25}px`,
                fontFamily: 'Arial',
                fill: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 3,
            });
        this.bestScoreText = this.add.text(paddingX, paddingY + lineSpacing, 'Best Score: ' + 'XXX',
            textStyle = {
                fontSize: `${15}px`,
                fontFamily: 'Arial',
                fill: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 3,
            });

    }

    increaseScore() {
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
    }
}

export default PlayScene;