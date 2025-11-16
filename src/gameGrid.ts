import Phaser from 'phaser';

//ikonka (buňka)
export type Cell = {
    type: number;                           // typ ikonky (0–4)
    sprite?: Phaser.GameObjects.Image;      
};

export class GameGrid {
    private grid: Cell[][];
    private payouts = [2, 5, 10, 50, 1000];
    constructor(
        private scene: Phaser.Scene,
        private size: number = 4,
        private iconTypes: number = 5,
        private cellSize: number = 112,
        private offsetX: number = 282,
        private offsetY: number = 180
    ) {
        this.grid = [];
        this.initGrid();
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
    generate() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                this.grid[r][c].type = this.getRandomType();
            }
        }
    }

    //vyčistí grid od ikonek
    clearSprites(onComplete?: () => void) {
    let totalAnimations = 0;

    for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
            const cell = this.grid[r][c];
            if (cell.sprite) {
                totalAnimations++;

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
                        sprite.destroy();
                        cell.sprite = undefined;

                        totalAnimations--;
                        if (totalAnimations === 0 && onComplete) {
                            onComplete(); // callback
                        }
                    }
                });
            }
        }
    }

    if (totalAnimations === 0 && onComplete) {
        onComplete();
    }
    }


    //renderuje grid a ikonky jako image
    render(onComplete?: () => void) {

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

                const sprite = this.scene.add
                    .image(targetX, startY, textureKey)
                    .setDisplaySize(this.cellSize, this.cellSize)
                    .setInteractive()
                    .setDepth(1);

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
                    if (total === 0 && onComplete) onComplete();
                    }
                });
            }
        }

        if (total === 0 && onComplete) onComplete();
    }

    //výpočet výhry
    calculateWin(bet: number): number {
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
