import Phaser from "phaser";

class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }

    create() {
        console.log("You lost");
        this.cameras.main.setBackgroundColor(0xff0000);
        this.add.image(this.scale.width * 0.5, this.scale.height * 0.5, 'background').setAlpha(0.5);
        this.add.text(this.scale.width * 0.5, this.scale.height * 0.47, "Game Over", { fontSize: '50px', fill: '#ffffff', align: 'center', fontStyle: 'bold'}).setOrigin(0.5);
        this.add.text(this.scale.width * 0.5, this.scale.height * 0.57, "Try Again", { fontSize: '32px', fill: '#ffffff', align: 'center'}).setOrigin(0.5);

    }

    update() {
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.start('MenuScene');
            },
            loop: false
        })
    }
}

export default GameOver;