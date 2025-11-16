import Phaser from 'phaser';
import { InfoPanel } from './infoPanel';
import { GameGrid } from './gameGrid';
import { BackgroundGame } from './backgroundGame';

export class GameEngine extends Phaser.Scene
{
    public star_bg: Phaser.GameObjects.Image[] = [];
    public infoPanel!: InfoPanel;

    private creditText!: Phaser.GameObjects.Text;
    private winText!: Phaser.GameObjects.Text;
    private betText!: Phaser.GameObjects.Text;
    private credit: number = 1000;
    private win: number = 0;
    private currentBet: number = 5;

    private grid!: GameGrid;
    private isAnimating = false;

    preload ()
    {   
        this.load.image('logo', 'assets/logo.png');
        this.load.image('sky', 'assets/sky.jpg');
        this.load.image('star_bg', 'assets/star_bg.png');
        this.load.image('infoIcon', 'assets/info.png');
        this.load.image('button', 'assets/button.png');
        for (let i = 0; i < 5; i++) {
        this.load.image(`icon${i}`, "assets/sprites/icon" + i + ".jpg");
        }
    }

    create ()
    {   

        //logo
        this.add.image(120, 80, 'logo')
        .setDisplaySize(180, 120)
        .setDepth(2);

        //info panel
        this.infoPanel = new InfoPanel(this);

        //vytvoření pozadí
        BackgroundGame.run(this);

        //textová pole
        this.creditText = this.add.text(225, 645, `Kredit: ${this.credit} Kč`, {
            font: "24px Arial",
            color: "#000000"
        }).setDepth(2);

        this.winText = this.add.text(550, 645, `Výhra: ${this.win} Kč`, {
            font: "24px Arial",
            color: "#ffff00"
        }).setDepth(2);

        this.betText = this.add.text(450, 70, `Výše sázky: ${this.currentBet} Kč`, {
            font: "24px Arial",
            color: "#ffff00",
            backgroundColor: "#606060ff",
            padding: { x: 10, y: 5 },
        }).setOrigin(0.5)
        .setDepth(2);

        //------------------------

        // vytvoření gridu
        this.grid = new GameGrid(this);
        
        // generování herního pole
        this.grid.generate();
        this.grid.render();

        const button = this.add.image(800, 350, "button")
        .setInteractive()
        .setDisplaySize(120, 120)
        .setDepth(2);

        button.on("pointerdown", () => {

            if (this.isAnimating) return;
            this.isAnimating = true; //zablokuje button při animaci

            if (this.currentBet > this.credit) {
            return;
            }
            // odečte sázku
            this.credit -= this.currentBet;
            this.creditText.setText(`Kredit: ${this.credit} Kč`);

            // při kliknutí odstraň staré, proveď animaci a poté generuj nové ikonky
            this.grid.clearSprites(() => {
                this.time.delayedCall(100, () => {
                    this.grid.generate();
                    this.grid.render(() => {
                        this.isAnimating = false; // odblokuje button

                        //zobrazí výhru a přičte částku k zůstatku
                        const winAmount = this.grid.calculateWin(this.currentBet);
                        this.win = winAmount;
                        this.winText.setText(`Výhra: ${this.win} Kč`);
                        if (winAmount > 0) {
                            this.credit += winAmount;
                            this.creditText.setText(`Kredit: ${this.credit} Kč`);
                        }

                        this.blinkWinText();
                    });
                });  
            });  

        });
        
    }

    //blikající text po výhře
    blinkWinText(times: number = 10, duration: number = 100) {
    if (this.win <= 0) return;
    //tween
    this.tweens.add({
        targets: this.winText,
        alpha: 0,
        yoyo: true,
        repeat: times - 1,
        duration: duration,
        ease: "Linear",
        onComplete: () => {
            this.winText.setAlpha(1); 
        }
    });   
    }

}
