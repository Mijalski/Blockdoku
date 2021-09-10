import blockPng from './../assets/block.png';
import tile1Png from './../assets/tile1.png';
import tile2Png from './../assets/tile2.png';
import Phaser from 'phaser';

const gridSize = 9;
const tilePngSize = 80;

export default class GameScene extends Phaser.Scene
{
    tiles = [ 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    tileScale;
    margin;
    screenSize;
    tileSize;

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
        this.cameras.main.backgroundColor.setTo(0, 255, 255); 
        this.margin = (this.cameras.main.width * 0.2) / 2;
        this.screenSize = this.cameras.main.width - (this.margin * 2);
        this.tileScale = (tilePngSize * this.screenSize / (gridSize * tilePngSize)) / tilePngSize;
        this.tileSize = this.screenSize / 9;
        console.log(this.margin);
        console.log(this.screenSize);
        console.log(this.tileScale);
        console.log(this.tileSize);
        console.log(this.tileSize* 9)

        this.add.image(this.cameras.main.width/2, this.cameras.main.height-40, 'block');
    }

    update(time, delta) 
    {
        for(let x = 0; x < gridSize; x++) {
            for(let y = 0; y < gridSize; y++) {
                let tile = this.add.image(this.margin + (x * this.tileSize) + x + this.tileSize/2, this.margin + (y * this.tileSize) + y + this.tileSize/2, 'tile1');
                tile.setScale(this.tileScale);
            }
        }
    }
}