import blockPng from './../assets/block.png';
import tile1Png from './../assets/tile1.png';
import tile2Png from './../assets/tile2.png';
import Phaser from 'phaser';

const gridSize = 9;
const maxActiveBlocks = 3;
const tilePngSize = 80;
const blockDefinitions = [
    // Horizontal Lines
    [1], 
    [1,1], 
    [1,1,1], 
    [1,1,1,1],
    [1,1,1,1,1],

    // Vertical Lines
    [1,-1,1],
    [1,-1,1,-1,1],
    [1,-1,1,-1,1,-1,1],
    [1,-1,1,-1,1,-1,1,-1,1],

    // Small L
    [1,-1,1,1], // |_
    [0,1,-1,1,1], // _|
    [1,1,-1,0,1], // ^|
    [1,1,-1,1], // |^

    // L
    [1,-1,1,-1,1,1], // |_
    [0,1,-1,0,1,-1,1,1], // _|
    [1,1,-1,0,1,-1,0,1], // ^|
    [1,1,-1,1,0,-1,1,0], // |^

    // BIG L
    [1,-1,1,-1,1,1,1], // |__
    [0,0,1,-1,0,0,1,-1,1,1,1], // __|
    [1,1,1,-1,0,0,1,-1,0,0,1], // ^^|
    [1,1,1,-1,1,-1,1], // |^^

    // T
    [0,1,-1,0,1,-1,1,1,1], // _|_
    [1,1,1,-1,0,1,-1,0,1], // ^|^
    [1,-1,1,1,1,-1,1], // |-
    [0,0,1,-1,1,1,1,-1,0,0,1], // -|

    // Pointer
    [0,1,-1,1,1,1], // _|_
    [1,-1,1,1,-1,1], // |-
    [1,1,1,-1,0,1], // -.-
    [0,1,-1,1,1,-1,0,1], // -|

    // Two Dots
    [1,-1,0,1],
    [0,1,-1,1],

    // Three Dots
    [1,-1,0,1,-1,0,0,1],
    [0,0,1,-1,0,1,-1,1],

    // Others
    [0,1,-1,1,1,1,-1,0,1] // -|-
];

export default class GameScene extends Phaser.Scene
{
    tiles;
    tileImages;
    blockImages;
    tileScale; pickerTileScale;
    margin; halfMargin;
    screenSize;
    tileSize; halfTileSize;
    activeBlockDefinitions; unplaceableActiveBlockDefinitions;
    blockPickerPositionX; blockPickerPositionY;
    chosenBlockDefinition; chosenBlockImages; chosenBlockIndex;
    chosenGridTileCoordinates;
    score; scoreText;

    constructor()
    {
        super('game-scene');
    }

    preload()
    {
        this.load.image('block', blockPng);
        this.load.image('tile1', tile1Png);
        this.load.image('tile2', tile2Png);
    }
      
    create()
    {
        this.tiles = [ [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0] ];
        this.tileImages = [];
        this.blockImages = [];
        this.unplaceableActiveBlockDefinitions = [];

        this.cameras.main.backgroundColor.setTo(255, 255, 255); 

        this.margin = (this.cameras.main.width * 0.2);
        this.halfMargin = this.margin / 2;

        this.screenSize = this.cameras.main.width - (this.margin);

        this.tileScale = (tilePngSize * this.screenSize / (gridSize * tilePngSize)) / tilePngSize;
        this.pickerTileScale = this.tileScale / 2;

        this.tileSize = this.screenSize / 9;
        this.halfTileSize = this.tileSize / 2;

        this.blockPickerPositionX = this.screenSize / 3;
        this.blockPickerPositionY = this.screenSize + this.halfMargin;

        this.activeBlockDefinitions = this.getRandomBlocks();

        this.input.on('pointerup', (pointer, objectsClicked) => {   
            if (this.chosenBlockDefinition) {
                this.dropBlock(); 
            }
        });

        for (let i = 0; i < gridSize; i++) {
            this.tileImages[i] = [];
        }
        
        this.score = 0;
        this.scoreText = this.add.text(this.cameras.main.width / 2, 16, '0', { fontSize: '32px', fill: '#000' }).setOrigin(0.5);
        this.createGrid();
        this.renderBlocks();
    }

    update() {
        if (this.chosenBlockDefinition) {
            this.moveBlock(this.chosenBlockImages, this.chosenBlockDefinition, 
                this.chosenBlockDefinition[0] === 0 
                    ? this.input.mousePointer.x - this.tileSize
                    : this.input.mousePointer.x, 
                this.input.mousePointer.y - this.tileSize);
        }
    }

    finishGame() {
        this.scene.start('game-over-scene', { score: this.score });
    }

    dropBlock() {
        if (this.chosenGridTileCoordinates) {
            let [j , i] = this.chosenGridTileCoordinates;
            if (this.isValidPlacement(this.chosenBlockDefinition, j, i)) {
                this.placeBlock(j, i);
            } else {
                this.destroyBlocks();
                this.renderBlocks();
            }
        } else {
            this.destroyBlocks();
            this.renderBlocks();
        }
        this.chosenBlockImages = undefined;
        this.chosenBlockDefinition = undefined;
    }

    placeBlock(j, i) {
        const startingJ = j;
        let scoreToAdd = 0;
        this.chosenBlockDefinition.forEach(block => {
            if (block === 1) {
                this.tiles[j][i] = 1;
                scoreToAdd += 1;
            } 

            if (block === -1){
                i++;
                j = startingJ;
            } else {
                j++;
            }
        });

        this.activeBlockDefinitions[this.chosenBlockIndex] = undefined;
        const linesAndSquaresCount = this.replaceCorrectLinesAndSquares();
        scoreToAdd += linesAndSquaresCount * linesAndSquaresCount * 20;
        this.score += scoreToAdd;
        this.scoreText.setText(this.score);
        this.redrawGrid();
        this.destroyBlocks();
        this.addNewBlocks();
        this.unplaceableActiveBlockDefinitions = [];
        this.activeBlockDefinitions.forEach(blockDefinition => {
            if (blockDefinition && !this.hasBlockAnyValidPlacement(blockDefinition)) {
                this.unplaceableActiveBlockDefinitions.push(blockDefinition);
            }
        });
        if(this.unplaceableActiveBlockDefinitions.length === this.activeBlockDefinitions.filter(x => x != undefined).length) {
            this.finishGame();
        }
        this.renderBlocks();
    }

    addNewBlocks() {
        if (this.activeBlockDefinitions.every(x => x == undefined)) {
            this.activeBlockDefinitions = this.getRandomBlocks();
        }
    }

    destroyBlocks() {
        this.blockImages.flat().forEach(blockImage => {
            blockImage.destroy();
        })
    }

    replaceCorrectLinesAndSquares() {
        const verticalIndexes = this.findVerticalLineIndexes();
        const horizontalIndexes = this.findHorizontalLineIndexes();
        const squareCoordinates = this.findSquareCoordinates();
        
        this.replaceValidTiles(verticalIndexes, horizontalIndexes, squareCoordinates);

        return verticalIndexes.length + horizontalIndexes.length + squareCoordinates.length;
    }

    replaceValidTiles(verticalIndexes, horizontalIndexes, squareCoordinates) {
        verticalIndexes.forEach(idx => {
            for(let i = 0; i < gridSize; i++) {
                this.tiles[idx][i] = 0;
            }
        });
        horizontalIndexes.forEach(idx => {
            for(let j = 0; j < gridSize; j++) {
                this.tiles[j][idx] = 0;
            }
        });
        squareCoordinates.flat().forEach(([j, i]) => {
            this.tiles[j][i] = 0;
        });
    }

    findVerticalLineIndexes() {
        const indexes = [];
        this.tiles.forEach((line, idx) => {
            if (line.every(x => x === 1)) {
                indexes.push(idx);
            }
        });
        return indexes;
    }

    findHorizontalLineIndexes() {
        const indexes = []
        for(let i = 0; i < gridSize; i++) {
            let isValid = true;
            for(let j = 0; j < gridSize; j++) {
                if (this.tiles[j][i] === 0) {
                    isValid = false;
                    break;
                }
            }
            if(isValid) {
                indexes.push(i);
            }
        }
        return indexes;
    }

    findSquareCoordinates() {
        const coordinates = []
        for(let i = 0; i < gridSize; i++) {
            const currentCoordinates = this.getTileCoordinatesForSquareIndex(i);
            let isValid = true;
            for(let [j, i] of currentCoordinates) {
                if (this.tiles[j][i] === 0) {
                    isValid = false;
                    break;
                }
            }
            if(isValid) {
                coordinates.push(currentCoordinates);
            }
        }
        return coordinates;
    }

    getTileCoordinatesForSquareIndex(squareIndex) {
        if (squareIndex < 3) {
            return [[0, squareIndex * 3], [0, squareIndex * 3 + 1], [0, squareIndex * 3 + 2],
                    [1, squareIndex * 3], [1, squareIndex * 3 + 1], [1, squareIndex * 3 + 2],
                    [2, squareIndex * 3], [2, squareIndex * 3 + 1], [2, squareIndex * 3 + 2]];
        }
        if (squareIndex < 6) {
            squareIndex = squareIndex % 3;
            return [[3, squareIndex * 3], [3, squareIndex * 3 + 1], [3, squareIndex * 3 + 2],
                    [4, squareIndex * 3], [4, squareIndex * 3 + 1], [4, squareIndex * 3 + 2],
                    [5, squareIndex * 3], [5, squareIndex * 3 + 1], [5, squareIndex * 3 + 2]];
        }
        squareIndex = squareIndex % 6;
        return [[6, squareIndex * 3], [6, squareIndex * 3 + 1], [6, squareIndex * 3 + 2],
                [7, squareIndex * 3], [7, squareIndex * 3 + 1], [7, squareIndex * 3 + 2],
                [8, squareIndex * 3], [8, squareIndex * 3 + 1], [8, squareIndex * 3 + 2]];
    }

    createGrid() {
        for(let i = 0; i < gridSize; i++) {
            for(let j = 0; j < gridSize; j++) {
                this.tileImages[j].push(this.add.image(
                                            this.halfMargin + (j * this.tileSize) + j + this.halfTileSize, 
                                            this.halfMargin / 2 + (i * this.tileSize) + i + this.halfTileSize,
                                            this.tiles[j][i] == 0 ? this.getTileImage(j, i) : 'block')
                                .setScale(this.tileScale)
                                .setInteractive()
                                .on('pointerover', pointer => {
                                    this.pointerOverGridTile(j, i);
                                }));
            }
        }
    }

    redrawGrid() {
        for(let i = 0; i < gridSize; i++) {
            for(let j = 0; j < gridSize; j++) {
                this.tileImages[j][i] = this.add.image(
                                                this.halfMargin + (j * this.tileSize) + j + this.halfTileSize, 
                                                this.halfMargin / 2  + (i * this.tileSize) + i + this.halfTileSize,
                                                this.tiles[j][i] == 0 ? this.getTileImage(j, i) : 'block')
                                        .setScale(this.tileScale)
                                        .setInteractive()
                                        .on('pointerover', pointer => {
                                            this.pointerOverGridTile(j, i);
                                        });
            }
        }
    }

    pointerOverGridTile(j, i) {
        if (this.chosenBlockDefinition) {
            this.resetGridHighlight();
            if (this.isValidPlacement(this.chosenBlockDefinition, j, i)) {
                this.chosenGridTileCoordinates = [j, i];
                this.highlightGrid(j, i);
            } else {
                this.chosenGridTileCoordinates = undefined;
            }
        }
    }

    resetGridHighlight() {
        for(let i = 0; i < gridSize; i++) {
            for(let j = 0; j < gridSize; j++) {
                this.tileImages[i][j].setTint(0xffffff);
            }
        }
    }

    highlightGrid(j, i) {
        const startingJ = j;
        this.chosenBlockDefinition.forEach(block => {
            if (block === 1) {
                this.tileImages[j][i].setTint(0x333333);
            } 

            if (block === -1){
                i++;
                j = startingJ;
            } else {
                j++;
            }
        });
    }

    isValidPlacement(blockDefinition, j, i) {
        const startingJ = j;

        for(const block of blockDefinition) {
            if (block === 1) {
                if (j >= gridSize || i >= gridSize || this.tiles[j][i] === 1) {
                    return false;
                }
            } 

            if (block === -1){
                i++;
                j = startingJ;
            } else {
                j++;
            }
        }

        return true;
    }

    getTileImage(x, y) {
        if ((x > 2 && x < 6 && (y < 3 || y > 5)) 
            || (y > 2 && y < 6 && (x < 3 || x > 5)))
            return 'tile1';
        return 'tile2';
    }

    moveBlock(blockImages, blockDefinition, x, y) {
        const startingX = x;
        let blockIndex = 0;
        blockDefinition.forEach(block => {
            if(block === -1) {
                y += this.tileSize;
                x = startingX;
            } 
            else {
                if(block === 1) {
                    blockImages[blockIndex]
                        .setPosition(x + this.tileSize, y + this.tileSize);
                    blockIndex++;
                }
                x += this.tileSize;
            }
        });
    }

    renderBlocks() {
        this.activeBlockDefinitions.forEach((blockDefinition, idx) => {
            if (blockDefinition) {
                let x = this.blockPickerPositionX * idx + this.halfMargin;
                let y = this.blockPickerPositionY;
                this.renderBlock(blockDefinition, x, y, idx);
            }
        });
    }

    renderBlock(blockDefinition, x, y, index) {
        let startingX = x;
        let blockImages = [];
        const canBePlaced = !this.unplaceableActiveBlockDefinitions.find(x => x === blockDefinition);
        blockDefinition.forEach(block => {
            if (block === -1) {
                y += this.halfTileSize;
                x = startingX;
            } else {
                x += this.halfTileSize;
                if (block === 1) {
                    blockImages.push(this.add.image(x + this.halfTileSize, y + this.halfTileSize, 'block')
                                    .setScale(this.pickerTileScale)
                                    .setInteractive()
                                    .setTint(canBePlaced ? 0xffffff : 0x333333)
                                    .on('pointerdown', pointer => {
                                        if (canBePlaced) {
                                            blockImages.forEach(img => {
                                                img.setScale(this.tileScale);
                                            });
                                            this.chosenBlockImages = blockImages;
                                            this.chosenBlockDefinition = blockDefinition;
                                            this.chosenBlockIndex = index;
                                        } 
                                    }));
                }
            }
        });
        this.blockImages.push(blockImages);
    }

    hasBlockAnyValidPlacement(blockDefinition) {
        for(let i = 0; i < gridSize; i++) {
            for(let j = 0; j < gridSize; j++) {
                if (this.isValidPlacement(blockDefinition, j, i)) {
                    return true
                }
            }
        }
        return false;
    }

    getRandomBlocks() {
        const arr = [];
        for(let i = 0; i < maxActiveBlocks; i++) {
            arr.push(blockDefinitions[this.getRandomBlockDefinitionIndex()]);
        }
        return arr;
    }

    getRandomBlockDefinitionIndex() {
        return Math.floor(Math.random() * (blockDefinitions.length - 0));
    }
}