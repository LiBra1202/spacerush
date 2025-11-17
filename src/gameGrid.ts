import Phaser from 'phaser';
import { MainScene } from './scene';
import Sprite = Phaser.GameObjects.Sprite;

//ikonka (buňka)
export type Cell = {
    type: number;                           // typ ikonky (0–4)
    sprite?: Sprite;
};

export class GameGrid {
    private grid: Cell[][];
    private payouts = [2, 5, 10, 50, 1000];
    private scene: MainScene
    private size: number = 4;
    private iconTypes: number = 5;
    private cellSize: number = 112;
    private offsetX: number = 282;
    private offsetY: number = 180;
    constructor(scene: MainScene) {
        this.grid = [];
        this.scene = scene;
        this.initGrid();
        this.renderGrid();
    }

    //grid z cells
    private initGrid() {
        this.grid = Array.from({ length: this.size }, () =>
            Array.from({ length: this.size }, () => ({
                type: -1,
                sprite: undefined
            }))
        );
    }

    //vrací random ikonku
    private getRandomType(): number {
        return Phaser.Math.Between(0, this.iconTypes - 1);
    }

    //nasází random ikonky do gridu
    private generate() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                this.grid[r][c].type = this.getRandomType();
            }
        }
    }

    //vyčistí grid od ikonek
    private clearSprites() {

        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const cell = this.grid[r][c];

                if (cell.sprite) {

                    const sprite = cell.sprite;

                    // zrušení tweenů
                    this.scene.tweens.killTweensOf(sprite);

                    // fade-out
                    this.scene.tweens.add({
                        targets: sprite,
                        alpha: 0,
                        duration: 150,
                        ease: "Linear",
                        onComplete: () => {
                            sprite.destroy(true);
                        }
                    });
                }
            }
        }
    }



    //renderuje grid a ikonky jako image
    public renderGrid (onComplete ?: () => void) {

    this.clearSprites();
    this.generate();

    this.scene.startButton.disable();

    let total = this.size * this.size;

    for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {

            const cell = this.grid[r][c];
            const textureKey = `icon${cell.type}`;

            // cílové pozice v gridu při pádu
            const targetX = this.offsetX + c * this.cellSize;
            const targetY = this.offsetY + r * this.cellSize;

            // počáteční pozice při animaci pádu
            const startY = -200;

            const sprite = new Sprite(this.scene, targetX, startY, "default", textureKey);
            sprite.setDisplaySize(this.cellSize, this.cellSize)
            this.scene.add.existing(sprite);

            cell.sprite = sprite;

            // animace pádu
            this.scene.tweens.add({
                targets: sprite,
                y: targetY,
                duration: 500,
                delay: c * 60 + r * 40,
                ease: "Cubic.easeOut",
                onComplete: () => {
                    total--;
                    if (total === 0) {
                        this.scene.startButton.enable();
                        if (onComplete) { onComplete(); }
                    }
                }
            });
        }
    }
}

    //výpočet výhry
    public calculateWin(bet: number): number {
    const counts = [0, 0, 0, 0, 0]; // počty ikon

    for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
            const type = this.grid[r][c].type;
            counts[type]++;
        }
    }
    // hledá jestli se ikona objevila 8x nebo více
    for (let i = 0; i < counts.length; i++) {
        if (counts[i] >= 8) {
            // výhra = sázka × násobek
            return bet * this.payouts[i];
        }
    }
    // pokud žádná ikona není 8×, výhra 0
    return 0;
}

}
