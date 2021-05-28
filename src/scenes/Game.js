import 'phaser';

class Game extends Phaser.Scene {
    constructor(config) {
    	super('Game');
        window.game = this;
    }

    createPlayer() {
        const { width, height } = game.sys.canvas;
        const player = this.add.sprite( width / 2, height / 2, 'player', 'adventurer_hang.png');

        let frameNames;
        // Create the walk animation
        frameNames = this.anims.generateFrameNames('player', {
                         start: 1, end: 2, zeroPad: 0,
                         prefix: 'adventurer_walk', suffix: '.png'
                     });
        this.anims.create({ key: 'walk', frames: frameNames, frameRate: 8, repeat: -1 });
        // Create idle
        frameNames = [{ key: "player", frame: "adventurer_idle.png"}];
        this.anims.create({ key: 'idle', frames: frameNames, frameRate: 1, repeat: -1 });

        player.anims.play('walk');

        this.player = player;
    }

    create() {
        this.createPlayer();
    }
}

export default Game;