import Phaser from "phaser";

class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
        this.menu = null;
    }

    create() {
        console.log("Starting Game");
        this.add.image(this.scale.width * 0.5, this.scale.height * 0.5, 'background').setAlpha(0.5);
        this.add.text(this.scale.width * 0.5, this.scale.height * 0.47, "Start Game", { fontSize: '50px', fill: '#ffffff', align: 'center', fontStyle: 'bold'}).setOrigin(0.5);
    
        this.input.once('pointerdown', () => {
            console.log("Clicked!");
            this.scene.start('PlayScene');
        }, this);
        this.input.keyboard.on('keydown-SPACE', () => {
            console.log("Spaced");
            this.scene.start('PlayScene')}, this);
    }
}

export default MenuScene;