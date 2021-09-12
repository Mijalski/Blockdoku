import Phaser from 'phaser';
import GameOverScene from './scenes/game-over-scene.js';
import GameScene from './scenes/game-scene.js';

const MAX_SIZE_WIDTH_SCREEN = 1080
const MAX_SIZE_HEIGHT_SCREEN = 1920
const MIN_SIZE_WIDTH_SCREEN = 960
const MIN_SIZE_HEIGHT_SCREEN = 540
const SIZE_WIDTH_SCREEN = 960
const SIZE_HEIGHT_SCREEN = 540

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1440,
        height: 1850
    },
    scene: [GameScene, GameOverScene]
};

const game = new Phaser.Game(config);