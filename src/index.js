import Phaser from 'phaser';
import GameOverScene from './scenes/game-over-scene.js';
import GameScene from './scenes/game-scene.js';

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: 700,
    height: 900,
    scene: [GameScene, GameOverScene]
};

const game = new Phaser.Game(config);