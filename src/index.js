import Phaser from 'phaser';
import GameOverScene from './scenes/game-over-scene.js';
import GameScene from './scenes/game-scene.js';

// Aspect Ratio 9:16 - Portrait
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
        mode: Phaser.Scale.RESIZE,
        parent: 'game',
        width: SIZE_WIDTH_SCREEN,
        height: SIZE_HEIGHT_SCREEN,
        min: {
            width: MIN_SIZE_WIDTH_SCREEN,
            height: MIN_SIZE_HEIGHT_SCREEN
        },
        max: {
            width: MAX_SIZE_WIDTH_SCREEN,
            height: MAX_SIZE_HEIGHT_SCREEN
        }
    },
    scene: [GameScene, GameOverScene]
};

const game = new Phaser.Game(config);