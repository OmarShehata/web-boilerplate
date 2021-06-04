import 'phaser';

class Game extends Phaser.Scene {
    constructor(config) {
    	super('Game');
        window.game = this;
    }

    createPlayer() {
        const { width, height } = game.sys.canvas;
        const player = this.add.sprite( width / 2, height / 2, 'player', 'adventurer_hang.png');
        player.setOrigin(0.5, 0.5);

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
        // Create jump
        frameNames = [{ key: "player", frame: "adventurer_jump.png"}];
        this.anims.create({ key: 'jump', frames: frameNames, frameRate: 1, repeat: -1 });


        player.anims.play('idle');

        this.player = player;


        this.rightArrowKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.leftArrowKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.upArrowKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        // Connect to physics
        this.physics.add.existing(player, false);
        player.body.height = player.height - 30;
        player.body.width = player.width - 30;
        player.body.offset.x = player.body.width / 2 - 10;
        player.body.offset.y = player.body.height / 2 - 10;
        player.speed = 400;
        player.reset = function() {
            
            player.body.setVelocityX(0);
            player.body.setVelocityY(0);
            player.setPosition(width / 2, height / 2);

            player.anims.play('idle');
        }
    }

    _jumpPressed() {
        return this.upArrowKey.isDown || this.WKey.isDown;
    }

    _rightPressed() {
        return this.rightArrowKey.isDown || this.DKey.isDown;
    }

    _leftPressed() {
        return this.leftArrowKey.isDown || this.AKey.isDown;
    }

    _setPlayAnim(key) {
        if (this.player.anims.currentAnim.key !== key) {
            this.player.anims.play(key);
        }
    }

    _currentAnim() {
        return this.player.anims.currentAnim.key;
    }

    create() {
        this.createPlayer();

        this.RKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // Create ground
        const { width, height } = game.sys.canvas;

        const ground = this.add.sprite(width/2, height - 100, 'ground');
        this.physics.add.existing(ground, true);

        const ground2 = this.add.sprite(width/2 + 400, height - 300, 'ground_small');
        this.physics.add.existing(ground2, true);

        this._playerOnGround = false;

        this.physics.add.collider(this.player, [ground, ground2], (_player, _ground) => {
            if (_player.body.touching.down && _ground.body.touching.up) {
                this._playerOnGround = true;
            }
        });

        // Make camera follow player 
        // See: https://photonstorm.github.io/phaser3-docs/Phaser.Cameras.Scene2D.Camera.html#startFollow__anchor
        this.cameras.main.startFollow(this.player, false, 0.5, 0.5, 0, 100);
    }

    update () {
        const player = this.player;

        // If anim is idle, and pressing left/right, set to walk
        if (this._currentAnim() == 'idle' && (this._rightPressed() || this._leftPressed())) {
            this._setPlayAnim('walk');
        }

        if (this._rightPressed()) {
            player.flipX = false;
            player.body.setVelocityX(player.speed);
        }
        else if (this._leftPressed()) {
            player.flipX = true;
            player.body.setVelocityX(-player.speed);
        } else {
            player.body.setVelocityX(0);
        }

        // If character is walking, but no left/right pressed, set back to idle
        if (this._currentAnim() == 'walk' && !this._rightPressed() && !this._leftPressed()){
            this._setPlayAnim('idle');
        }

        // If character is walk/idle, and press up, then jump
        if ((this._currentAnim() == 'idle' || this._currentAnim() == 'walk')
            && this._jumpPressed()){
            this._setPlayAnim('jump');
            player.body.setVelocityY(-2000);
            this._playerOnGround = false;
        }

        if (this._playerOnGround == true && this._currentAnim() == "jump") {
            this._setPlayAnim("idle");
        }

        


        if (Phaser.Input.Keyboard.JustDown(this.RKey)) {
            player.reset();
        }

    }
}

export default Game;