import Text = Phaser.GameObjects.Text;
import { Textstyles } from './texstyles';
import { StartButton } from './startButton';

export class ControlPanel {

private scene: Phaser.Scene;
private startButton: StartButton;
private credit: number;
private win: number;
private currentBet: number;
public creditText!: Phaser.GameObjects.Text;
public winText!: Phaser.GameObjects.Text;
public betText!: Phaser.GameObjects.Text;

constructor(scene: Phaser.Scene, startButton: StartButton, credit: number, win: number, currentBet: number) 
{
        this.scene = scene;
        this.startButton = startButton;
        this.credit = credit;
        this.win = win;
        this.currentBet = currentBet;

        //textová pole
        this.creditText = new Text(scene, 150, 645, `Kredit: ${this.credit} Kč`, Textstyles.CreditText);
        scene.add.existing(this.creditText);

        this.winText = new Text(scene, 390, 645, `Výhra: ${this.win} Kč`, Textstyles.WinText);
        scene.add.existing(this.winText);

        this.betText = new Text(scene, 600, 645, `Výše sázky: ${this.currentBet} Kč`, Textstyles.BetText);
        scene.add.existing(this.betText);

}

// nastaví kredit po změně
public setCredit(value: number) {
    this.credit = value;
    this.creditText.setText(`Kredit: ${this.credit} Kč`);
}

// zobrazí výhru
public setWin(value: number) {
    this.win = value;
    this.winText.setText(`Výhra: ${this.win} Kč`);
}

/* 
public setCurrentBet(value: number) {
    this.currentBet = value;
    this.betText.setText(`Výše sázky: ${this.currentBet} Kč`);
} 
*/

//blikající text po výhře
public animWinText(times: number = 5, duration: number = 100) {
    if (this.win <= 0) return;
    //tween
    this.scene.tweens.add({
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