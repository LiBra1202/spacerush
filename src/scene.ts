import Phaser from 'phaser';
import Sprite = Phaser.GameObjects.Sprite;
import { Star } from './star';
import { InfoPanel } from './infoPanel';
import { StartButton } from './startButton';
import { ControlPanel } from './controlPanel';
import { GameGrid } from './gameGrid';

export class MainScene extends Phaser.Scene {
    public infoPanel!: InfoPanel;
    public controlPanel!: ControlPanel;
    public startButton: StartButton;
    private grid!: GameGrid;
    private credit: number = 1000;
    private win: number = 0;
    private currentBet: number = 5;

    preload() {
        this.load.atlas("default", "assets/textury/spacerush.png", "assets/textury/spacerush.json");
    }

    create() {

        // pozadí

        const background = new Sprite(this, 400, 300, "default", "sky");
        this.add.existing(background);

        // hvězdičky na pozadí

        const stars = new Star(this, 0, 0)
        this.add.existing(stars);

        // vytvoření loga

        const logo = new Sprite(this, 120, 80, "default", "logo").setDisplaySize(180, 120);
        this.add.existing(logo);   
        
        // vytvoření info panelu

        this.infoPanel = new InfoPanel(this);

        // vytvoření start button, gridu

        this.startButton = new StartButton(this, 800, 350, "default", "button");
        this.add.existing(this.startButton);

        // vytvoření control panelu

        this.controlPanel = new ControlPanel(this, this.startButton, this.credit, this.win, this.currentBet);

        // vytvoření gridu

        this.grid = new GameGrid(this);

        //logika po kliknutí
        this.startButton.on("pointerup",  () => {

            if (this.currentBet > this.credit) {
                return;
            }
            // odečte sázku
            this.credit -= this.currentBet;
            this.controlPanel.setCredit(this.credit);
            
            this.grid.renderGrid(() => {
            //zobrazí výhru, přičte částku k zůstatku, rozblíká text
            const winAmount = this.grid.calculateWin(this.currentBet);
            this.win = winAmount;
            this.controlPanel.setWin(this.win);
            if (winAmount > 0) {
                this.startButton.disable();
                this.credit += winAmount;
                this.controlPanel.setCredit(this.credit);
                this.controlPanel.animWinText();
                }
            });

        }); 
    }

}
