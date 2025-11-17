import Sprite = Phaser.GameObjects.Sprite;
import Container = Phaser.GameObjects.Container;
export class Star extends Container {

  private stars: Sprite[] = []

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, 900);
      const y = Phaser.Math.Between(0, 700);

      const star = new Sprite(scene, x, y, "default", 'star_bg')
        .setAlpha(Phaser.Math.FloatBetween(0.2, 1))
        .setScale(Phaser.Math.FloatBetween(0.5, 1))
      
      this.add(star);
      this.stars.push(star);
    }

    this.playAnim();
  }

  private playAnim(): void {

    this.scene.tweens.add({
      targets: this.stars,
      alpha: { from: 0.2, to: 1 },
      duration: Phaser.Math.Between(500, 1500),
      yoyo: true,
      repeat: -1,
      delay: (target:any) => {
        const index = this.stars.indexOf(target);
        return index * 500;
      }
    });


  }
}