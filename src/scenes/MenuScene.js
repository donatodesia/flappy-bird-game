import Phaser from "phaser";

class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
        this.menu = null;
        this.startGame = null;
        // this.bestScore = null;
    }

    create() {
        this.add.image(this.scale.width * 0.5, this.scale.height * 0.5, 'background').setAlpha(0.5);
        this.startGame = this.add.text(this.scale.width * 0.5, this.scale.height * 0.47, "Start Game", { fontSize: '50px', fill: '#ffffff', align: 'center', fontStyle: 'bold'})
            .setOrigin(0.5)
            .setInteractive({ cursor: 'pointer' });
        this.startGame.on('pointerdown', () => {
            console.log("Starting Game");
            this.scene.start('PlayScene');
        }, this);
        this.input.keyboard.on('keydown-SPACE', () => {
            console.log("Starting Game through Space");
            this.scene.start('PlayScene')}, this);

        // Hover Start
        this.startGame.on('pointerover', () => {
            this.startGame.setTint(0xaaaaaa);
        });
        this.startGame.on('pointerout', () => {
            this.startGame.clearTint();
        });

        // this.bestScore = localStorage.getItem('')
    }
}

export default MenuScene;