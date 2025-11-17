import Sprite = Phaser.GameObjects.Sprite;
export class StartButton extends Sprite{


  constructor(scene: Phaser.Scene, x: number, y: number,texture:string,frame:string)
  {
    super(scene, x, y, texture, frame);
    this.setDisplaySize(120, 120)
    this.enable();
  }


  public enable(): void
  {
    this.setInteractive();
    this.setAlpha(1);
  }

  public disable(): void{
    this.disableInteractive();
    this.setAlpha(0.5);
  }


}