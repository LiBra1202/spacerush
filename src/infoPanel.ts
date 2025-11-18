import Phaser from 'phaser';

export class InfoPanel {
    private scene: Phaser.Scene;
    private icon: Phaser.GameObjects.Image;
    private text: Phaser.GameObjects.Text;
    private visible: boolean = false;

    constructor(scene: Phaser.Scene) 
    {
        this.scene = scene;

        // ikonka
        this.icon = scene.add.image(50, 645,"default", 'info')
            .setInteractive()
            .setScale(0.6)
            .setDepth(1000) 
            .setScrollFactor(0)
            .setOrigin(0.5);

        this.text = scene.add.text(450, 350,
`PRAVIDLA HRY SPACE RUSH:

- Kliknutím na tlačítko spustíš ikony
- Pokud se některá ikona objeví 9x nebo více, vyhráváš
- Násobky vkladu u výher:
  Strom: 2x
  Měsíc: 5x
  Slunce: 10x
  Saturn: 50x
  Kometa: 1000x`,
        {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 30, y: 30 },
            align: 'left',
            wordWrap: { width: 500 }
        })
        .setOrigin(0.5)
        .setAlpha(0)
        .setDepth(999) 
        .setVisible(false)
        this.text.setInteractive();

        // kliknutí na ikonku zobrazí a skryje pravidla
        this.icon.on('pointerdown', (
            _pointer: Phaser.Input.Pointer, 
            _localX: number, 
            _localY: number, 
            event: Phaser.Types.Input.EventData
            ) => {
                event.stopPropagation();
                this.toggle();
            });

        // kliknutí na text skryje pravidla
        this.text.on('pointerdown', (
            _pointer: Phaser.Input.Pointer, 
            _localX: number, 
            _localY: number, 
            event: Phaser.Types.Input.EventData
            ) => {
                event.stopPropagation();
                this.toggle();
            });    
    }

    //po kliknutí
    private toggle() 
    {
        this.visible = !this.visible;
        this.text.setVisible(true);

        this.scene.tweens.add({
            targets: this.text,
            alpha: this.visible ? 1 : 0,
            duration: 300,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                if (!this.visible) {
                    this.text.setVisible(false);
                }
            }
        });
    }
}
