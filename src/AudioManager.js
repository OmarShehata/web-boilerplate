let audioSprites = {};
let game;
let muted = false;
const MUSIC_MASTER_VOLUME = 1;

class AudioSprite {
  constructor(name) {
    // Assumes you loaded all sounds in an audio sprite named "audio"
    const sprite = game.sound.addAudioSprite("audio");
    audioSprites[name] = this;
    this.sprite = sprite;
    this.name = name;
  }

  fadeIn(duration) {
    const sp = this.sprite;
    if (sp.isPlaying == false) {
      sp.play(this.name, { loop: true, volume: 0 });
    }
    if (sp.volume > MUSIC_MASTER_VOLUME) {
      sp.volume = 0;
    }

    if (duration == undefined) {
      duration = 1000;
    }

    if (this.tween) this.tween.stop();
    this.tween = game.tweens.add({
      targets: sp,
      volume: MUSIC_MASTER_VOLUME,
      duration: duration,
      ease: "Linear",
      onComplete: () => {
        this.tween = undefined;
      },
    });
  }

  fadeOut(duration) {
    const sp = this.sprite;

    if (duration == undefined) {
      duration = 1000;
    }

    if (this.tween) this.tween.stop();
    this.tween = game.tweens.add({
      targets: sp,
      volume: 0,
      duration: duration,
      ease: "Linear",
      onComplete: () => {
        this.tween = undefined;
      },
    });
  }
}

// Sound config: https://photonstorm.github.io/phaser3-docs/Phaser.Types.Sound.html#.SoundConfig

class AudioManager {
  static setGameScene(s) {
    game = s;

    const Mkey = game.input.keyboard.addKey("M");
    Mkey.on("up", () => {
      muted = !muted;
      game.sound.setMute(muted);
      localStorage.setItem("muted", muted)
    });
    if (localStorage.getItem("muted") === "true") {
      muted = true
      game.sound.setMute(muted);
    }
    
  }

  static getMuted() {
    return muted;
  }

  static stopAll() {
    const keys = Object.keys(audioSprites);
    for (let k of keys) {
      const sp = audioSprites[k];
      if (sp.tween) {
        sp.tween.stop();
      }
      sp.sprite.volume = 0;
      sp.sprite.stop();
    }
    audioSprites = {};
  }

  // Mainly for SFX
  static playOnce(name, config) {
    if (config == undefined) {
      config = {};
    }
    if (config.detune == undefined) {
      // Automatically randomizes pitch
      const min = -500;
      const max = 500;
      const range = max - min;
      config.detune = Math.random() * range + min;
    }

    game.sound.playAudioSprite("audio", name, config);
  }

  // For background music
  static create(name) {
    const sprite = new AudioSprite(name);
    return sprite;
  }

  static getSprite(name) {
    return audioSprites[name];
  }
}

export default AudioManager;
