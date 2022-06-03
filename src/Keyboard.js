let justDown;

class Keyboard {
  constructor(scene) {    
    this.keys = {};
    for (let key of Object.keys(Phaser.Input.Keyboard.KeyCodes)) {
      this.keys[key] = scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes[key]
      );
    }

    // Generate functions for common WASD/Arrow key movement
    const names = {
      "up": ["UP", "W"],
      "down": ["DOWN", "S"],
      "right": ["RIGHT", "D"],
      "left": ["LEFT", "A"]
    }
    for (let key of Object.keys(names)) {
      const entry = names[key]
      this[key] = function() {
        return this.pressed(entry[0]) || this.pressed(entry[1])
      }

      this[`${key}JustPressed`] = function() {
        return this.justPressed(entry[0]) || this.justPressed(entry[1])
      }
    }
  }

  justPressed(key) {
    return Phaser.Input.Keyboard.JustDown(this.keys[key])
  }

  pressed(key) {
    return this.keys[key].isDown
  }
}

export default Keyboard;
