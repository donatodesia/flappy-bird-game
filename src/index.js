import Phaser from 'phaser';
import PreloadScene from './scenes/PreloadScene';
import MenuScene from './scenes/MenuScene';
import PlayScene from './scenes/PlayScene';
import GameOver from './scenes/GameOver';

const config = {  // WebGL (Web graphics library): Js Api for rendering 2D and 3D grapichs.
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  scale:{
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {       // Arcade physics plugin, manages physics simulation.
      debug: true   // Debug Shows the green direction vector.
    }
  },
  scene: [PreloadScene, MenuScene, PlayScene, GameOver]
}
new Phaser.Game(config);
