import "phaser";
import Keyboard from "../Keyboard.js";
import AudioManager from "../AudioManager.js";

class Game extends Phaser.Scene {
  constructor(config) {
    super("Game");
    window.game = this;
  }

  create() {
    AudioManager.setGameScene(this);

    this.keys = new Keyboard(this);
    this.createPlayer();
    this.physics.world.drawDebug = false;

    // Create ground
    const { width, height } = game.sys.canvas;

    const ground = this.add.sprite(
      width / 2,
      height - 100,
      "atlas",
      "ground_snow"
    );
    this.physics.add.existing(ground, true);

    const ground2 = this.add.sprite(
      width / 2 + 400,
      height - 300,
      "atlas",
      "ground_snow_small"
    );
    this.physics.add.existing(ground2, true);

    this._playerOnGround = false;

    this.physics.add.collider(
      this.player,
      [ground, ground2],
      (_player, _ground) => {
        if (_player.body.touching.down && _ground.body.touching.up) {
          this._playerOnGround = true;
        }
      }
    );

    // Make camera follow player
    // See: https://photonstorm.github.io/phaser3-docs/Phaser.Cameras.Scene2D.Camera.html#startFollow__anchor
    this.cameras.main.startFollow(this.player, false, 0.5, 0.5, 0, 100);

    // Play background music
    this.mainLoop = AudioManager.create('879176_Pizza-Cat');
    this.mainLoop.fadeIn(1000);
  }

  createPlayer() {
    const { width, height } = game.sys.canvas;
    const player = this.add.sprite(
      width / 2,
      height / 2,
      "player",
      "adventurer_hang.png"
    );
    player.setOrigin(0.5, 0.5);

    let frameNames;
    // Create the walk animation
    frameNames = this.anims.generateFrameNames("player", {
      start: 1,
      end: 2,
      zeroPad: 0,
      prefix: "adventurer_walk",
      suffix: ".png",
    });
    this.anims.create({
      key: "walk",
      frames: frameNames,
      frameRate: 8,
      repeat: -1,
    });
    // Create idle
    frameNames = [{ key: "player", frame: "adventurer_idle.png" }];
    this.anims.create({
      key: "idle",
      frames: frameNames,
      frameRate: 1,
      repeat: -1,
    });
    // Create jump
    frameNames = [{ key: "player", frame: "adventurer_jump.png" }];
    this.anims.create({
      key: "jump",
      frames: frameNames,
      frameRate: 1,
      repeat: -1,
    });

    player.anims.play("idle");

    this.player = player;

    // Connect to physics
    this.physics.add.existing(player, false);
    player.body.height = player.height - 30;
    player.body.width = player.width - 30;
    player.body.offset.x = player.body.width / 2 - 10;
    player.body.offset.y = player.body.height / 2 - 10;
    player.speed = 400;
    player.reset = function () {
      player.body.setVelocityX(0);
      player.body.setVelocityY(0);
      player.setPosition(width / 2, height / 2);

      player.anims.play("idle");
    };
  }

  _setPlayAnim(key) {
    if (this.player.anims.currentAnim.key !== key) {
      this.player.anims.play(key);
    }
  }

  _currentAnim() {
    return this.player.anims.currentAnim.key;
  }

  update() {
    const player = this.player;

    // Debug draw
    if (this.keys.justPressed("Q")) {
      this.physics.world.drawDebug = !this.physics.world.drawDebug;
      if (this.physics.world.drawDebug == false) {
        this.physics.world.debugGraphic.clear();
      }
    }

    // If anim is idle, and pressing left/right, set to walk
    if (
      this._currentAnim() == "idle" &&
      (this.keys.left() || this.keys.right())
    ) {
      this._setPlayAnim("walk");
    }

    if (this.keys.right()) {
      player.flipX = false;
      player.body.setVelocityX(player.speed);
    } else if (this.keys.left()) {
      player.flipX = true;
      player.body.setVelocityX(-player.speed);
    } else {
      player.body.setVelocityX(0);
    }

    // If character is walking, but no left/right pressed, set back to idle
    if (
      this._currentAnim() == "walk" &&
      !this.keys.right() &&
      !this.keys.left()
    ) {
      this._setPlayAnim("idle");
    }

    // If character is walk/idle, and press up, then jump
    if (
      (this._currentAnim() == "idle" || this._currentAnim() == "walk") &&
      this.keys.upJustPressed()
    ) {
      this._setPlayAnim("jump");
      AudioManager.playOnce("jump_01")
      player.body.setVelocityY(-2000);
      this._playerOnGround = false;
    }

    if (this._playerOnGround == true && this._currentAnim() == "jump") {
      this._setPlayAnim("idle");
    }

    if (this.keys.justPressed("R")) {
      player.reset();
    }
  }
}

export default Game;
