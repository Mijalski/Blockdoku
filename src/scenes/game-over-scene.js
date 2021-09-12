export default class GameOverScene extends Phaser.Scene
{
    constructor ()
    {
        super('game-over-scene');
    }

    score;

    init(data) {
        console.log(data);
        this.score = data.score;
    }

    preload()
    {
        
    }
      
    create()
    {
        this.cameras.main.backgroundColor.setTo(255, 255, 255); 
        
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 3, 'Game over!', { fontSize: '32px', fill: '#000' }).setOrigin(0.5);
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, `Score: ${this.score}`, { fontSize: '48px', fill: '#000' }).setOrigin(0.5);
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 70, 'By Hubert Mijalski', { fontSize: '32px', fill: '#000' }).setOrigin(0.5);
        
        this.clickButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 100, 'Play Again', { fontSize: '32px', fill: '#000' })
                                    .setOrigin(0.5)
                                    .setInteractive({ useHandCursor: true })
                                    .on('pointerover', () => this.enterButtonHoverState() )
                                    .on('pointerout', () => this.enterButtonRestState() )
                                    .on('pointerdown', () => this.enterButtonActiveState() )
                                    .on('pointerup', () => {
                                        this.enterButtonHoverState();
                                        this.updateClickCountText();
                                    });
    }

    updateClickCountText() {
        this.scene.start('game-scene');
    }
    
    enterButtonHoverState() {
        this.clickButton.setStyle({ fill: '#333'});
    }

    enterButtonRestState() {
        this.clickButton.setStyle({ fill: '#222' });
    }

    enterButtonActiveState() {
        this.clickButton.setStyle({ fill: '#111' });
    }
}