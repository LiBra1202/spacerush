import Phaser from 'phaser';
import { InfoPanel } from './infoPanel';
import { GameGrid } from './gameGrid';
import Sprite = Phaser.GameObjects.Sprite;
import Text = Phaser.GameObjects.Text;
import { Star } from './star';
import { Textstyles } from './texstyles';
import { StartButton } from './startButton';

export class MainScene extends Phaser.Scene {
    public infoPanel!: InfoPanel;
    private creditText!: Phaser.GameObjects.Text;
    private winText!: Phaser.GameObjects.Text;
    private betText!: Phaser.GameObjects.Text;
    private credit: number = 1000;
    private win: number = 0;
    private currentBet: number = 5;
    public startButton: StartButton;
    private grid!: GameGrid;

    preload() {
        this.load.atlas("default", "assets/textury/spacerush.png", "assets/textury/spacerush.json");
    }

    create() {

        const background = new Sprite(this, 400, 300, "default", "sky");
        this.add.existing(background);

        const stars = new Star(this, 0, 0,)
        this.add.existing(stars);

        this.infoPanel = new InfoPanel(this);

        const logo = new Sprite(this, 120, 80, "default", "logo").setDisplaySize(180, 120);
        this.add.existing(logo);

        //textová pole
        this.creditText = new Text(this, 225, 645, `Kredit: ${this.credit} Kč`, Textstyles.CreditText);
        this.add.existing(this.creditText);

        this.winText = new Text(this, 550, 645, `Výhra: ${this.win} Kč`, Textstyles.WinText);
        this.add.existing(this.winText);

        this.betText = new Text(this, 450, 70, `Výše sázky: ${this.currentBet} Kč`, Textstyles.BetText).setOrigin(0.5).setDepth(2);
        this.add.existing(this.betText);

        //------------------------

        // vytvoření start button, gridu

        this.startButton = new StartButton(this, 800, 350, "default", "button");
        this.add.existing(this.startButton);

        this.grid = new GameGrid(this);

        //logika po kliknutí
        this.startButton.on("pointerup",  () => {

            if (this.currentBet > this.credit) {
                return;
            }
            // odečte sázku
            this.credit -= this.currentBet;
            this.creditText.setText(`Kredit: ${this.credit} Kč`);
            this.grid.renderGrid(() => {

            //zobrazí výhru, přičte částku k zůstatku, rozblíká text
            const winAmount = this.grid.calculateWin(this.currentBet);
            this.win = winAmount;
            this.winText.setText(`Výhra: ${this.win} Kč`);
            if (winAmount > 0) {
                this.startButton.disable();
                this.credit += winAmount;
                this.creditText.setText(`Kredit: ${this.credit} Kč`);
                this.animWinText();
                }
            });
        }); 
    }

    //blikající text po výhře
    private animWinText(times: number = 5, duration: number = 100) {
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
            this.startButton.enable();
        }
    });
    }

}
