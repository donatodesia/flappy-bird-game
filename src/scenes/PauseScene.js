import Phaser from "phaser";

class PauseScene extends Phaser.Scene {
    constructor() {
        super("PauseScene");
        this.menu = null;
        this.continueGame = null;
        this.exitGame = null;
    }
    preload() {
        this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0.7)');
    }
    create() {

        // Create Continue
        this.continueGame = this.add.text(this.scale.width * 0.5, this.scale.height * 0.46, "Continue", { fontSize: '38px', fill: '#ffffff', align: 'center', fontStyle: 'bold' })
            .setOrigin(0.47)
            .setInteractive({ cursor: 'pointer' });

        this.continueGame.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('PlayScene');
        }, this);

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop();
            this.scene.resume('PlayScene');
        }, this);



        // Create Exit
        this.exitGame = this.add.text(this.scale.width * 0.5, this.scale.height * 0.53, " Exit", { fontSize: '38px', fill: '#ffffff', align: 'center', fontStyle: 'bold' })
            .setOrigin(0.57)
            .setInteractive({ cursor: 'pointer' });

        this.exitGame.on('pointerdown', () => {
            console.log("Exiting Game!");
            this.scene.stop('PlayScene');
            this.scene.start('MenuScene')
        }, this);

        // Hover Continue
        this.continueGame.on('pointerover', () => {
            this.continueGame.setTint(0xaaaaaa);
        });
        this.continueGame.on('pointerout', () => {
            this.continueGame.clearTint();
        });

        // Hover Exit
        this.exitGame.on('pointerover', () => {
            this.exitGame.setTint(0xaaaaaa);
        });
        this.exitGame.on('pointerout', () => {
            this.exitGame.clearTint();
        });
    }
}

export default PauseScene;