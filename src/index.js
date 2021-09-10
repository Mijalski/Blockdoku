import GameScene from './scenes/game-scene.js';

import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: 700,
    height: 900,
    scene: GameScene
};

const game = new Phaser.Game(config);