import Container = Phaser.GameObjects.Container;
export class Star extends Container {

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.add(scene.add.particles(x, y, 'default', { 
    frame: "star_bg" ,
      
    x: { min: 0, max: 900 },
    y: { min: 0, max: 700 },

    scale: { min: 0.7, max: 1.2 },

    alpha: {
      start: Phaser.Math.FloatBetween(0, 0.5),
      end: Phaser.Math.FloatBetween(0.5, 1)
    },

    lifespan: () => Phaser.Math.Between(3000, 6000),
    frequency: 180,
    speed: 0
  
  })
  );

  }
}
