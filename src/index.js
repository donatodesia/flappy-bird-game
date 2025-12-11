import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';

const config = {  // WebGL (Web graphics library): Js Api for rendering 2D and 3D grapichs.
  type: Phaser.AUTO,
  width: 1800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {       // Arcade physics plugin, manages physics simulation.
      debug: true   // Debug Shows the green direction vector.
    }
  },
  scene: [PlayScene]
};

new Phaser.Game(config);
