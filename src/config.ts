import Phaser from 'phaser';
import { MainScene } from './scene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 900,
  height: 700,
  scene: MainScene
};

new Phaser.Game(config);