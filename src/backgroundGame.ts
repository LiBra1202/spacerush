import Phaser from 'phaser';
import { GameEngine } from './gameEngine';

export class BackgroundGame {
    public static run(scene: GameEngine) {

        scene.add.image(400, 300, 'sky').setDepth(-1);

        //hvězdičky na pozadí
        for (let i = 0; i < 40; i++) {
            const x = Phaser.Math.Between(0, 900);
            const y = Phaser.Math.Between(0, 700);

            const s = scene.add.image(x, y, 'star_bg')
                .setAlpha(Phaser.Math.FloatBetween(0.2, 1))
                .setScale(Phaser.Math.FloatBetween(0.5, 1))
                .setDepth(0); // před sky.jpg, za vším ostatním

            scene.tweens.add({
                targets: s,
                alpha: { from: 0.2, to: 1 },
                duration: Phaser.Math.Between(500, 1500),
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000)
            });

            scene.star_bg.push(s);
        }
    
    }
}    
