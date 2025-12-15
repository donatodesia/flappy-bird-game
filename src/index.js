import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';
// import ManuScene from './scenes/MenuScene';
import PreloadScene from './scenes/PreloadScene';

// const Scenes = [PreloadScene, MenuScene, PlayScene];
// const initScenes = () => Scenes.map((Scene) => new Scene(SHARED_CONFIG))


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
  // scene = initScene()
  scene: [PreloadScene, PlayScene]
}
new Phaser.Game(config);
