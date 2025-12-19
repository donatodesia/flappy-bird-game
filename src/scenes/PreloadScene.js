import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.load.image('background', 'assets/bg.png');
        this.load.image('sky', 'assets/sky.png');
        this.load.spritesheet('bird', 'assets/birdSprite.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('pauseButton', 'assets/pause.png');
    }

    create() {
        this.scene.start('MenuScene');
    }
}

export default PreloadScene;