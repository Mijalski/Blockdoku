import blockPng from './../assets/block.png';
import tile1Png from './../assets/tile1.png';
import tile2Png from './../assets/tile2.png';
import Phaser from 'phaser';

const gridSize = 9;
const tilePngSize = 80;
const blockDefinitions = [
    [1,1,1],
    [0,1,-1,1,1,1],
    [1,-1,1,-1,1,1]
];

export default class GameScene extends Phaser.Scene
{
    tiles = [ [0, 0, 1, 0, 0, 0, 0, 0, 0],
              [1, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 1, 0, 0, 0],
              [0, 0, 0, 0, 0, 1, 0, 0, 0] ];
    tileScale; pickerTileScale;
    margin; halfMargin;
    screenSize;
    tileSize; halfTileSize;
    activeBlocks;
    blockPickerPositionX; blockPickerPositionY;

    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('block', blockPng);
        this.load.image('tile1', tile1Png);
        this.load.image('tile2', tile2Png);
    }
      
    create ()
    {
        this.cameras.main.backgroundColor.setTo(255, 255, 255); 

        this.margin = (this.cameras.main.width * 0.2);
        this.halfMargin = this.margin / 2;

        this.screenSize = this.cameras.main.width - (this.margin);

        this.tileScale = (tilePngSize * this.screenSize / (gridSize * tilePngSize)) / tilePngSize;
        this.pickerTileScale = this.tileScale / 2;

        this.tileSize = this.screenSize / 9;
        this.halfTileSize = this.tileSize / 2;

        this.blockPickerPositionX = this.screenSize / 3;
        this.blockPickerPositionY = this.screenSize + (this.margin * 1.5);

        this.activeBlocks = this.getRandomBlocks();

        this.input.on('pointerup', (pointer, objectsClicked) => {    
            console.log('released');
        });

        this.renderGrid();
        this.renderBlocks();
    }

    renderGrid() {
        for(let x = 0; x < gridSize; x++) {
            for(let y = 0; y < gridSize; y++) {
                this.add.image(
                            this.margin + (x * this.tileSize) + x + this.halfTileSize, 
                            this.margin + (y * this.tileSize) + y + this.halfTileSize,
                            this.tiles[y][x] == 0 ? 'tile1' : 'block')
                        .setScale(this.tileScale);
            }
        }
    }

    renderBlocks() {
        this.activeBlocks.forEach((blockDefinition, idx) => {
            let y = this.blockPickerPositionY;
            let x = this.blockPickerPositionX * idx + this.margin;
            blockDefinition.forEach(block => {
                if(block === -1) {
                    y += this.halfTileSize;
                    x = this.blockPickerPositionX * idx + this.margin;
                } 
                else {
                    x += this.halfTileSize;
                    if(block === 1) {
                        this.add.image(x + this.halfTileSize, y + this.halfTileSize, 'block')
                                .setScale(this.pickerTileScale)
                                .setName(`block-${idx}`)
                                .setInteractive()
                                .on('pointerdown', pointer => {
                                    console.log(idx);
                                });
                    }
                }
            });
        });
    }

    getRandomBlocks() {
        return [blockDefinitions[0], blockDefinitions[1], blockDefinitions[2]];
    }
}