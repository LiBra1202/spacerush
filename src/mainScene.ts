import Phaser from 'phaser';
import { GameEngine } from './gameEngine';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 900,
  height: 700,
  scene: GameEngine
};

new Phaser.Game(config);