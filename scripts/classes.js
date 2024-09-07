//definition
class Sprite {
  constructor({
    position,
    offset = {
      x: 0,
      y: 0,
    },
    image = {
      src: "",
      maxFrames: 1,
      scale: 1,
    },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 100;
    this.velocity = { x: 0, y: 0 };
    this.lastKey = "";
    this.offset = offset;
    this.attackBox = {
      x: this.position.x,
      y: this.position.y,
      width: 100,
      height: 25,
    };
    this.scale = image.scale;
    this.isAttacking = false;
    this.health = 100;
    this.image = new Image();
    this.image.src = image.src;
    this.image.width = image.width ? image.width : this.image.width;
    this.image.height = image.height ? image.height : this.image.height;
    this.image.position = this.position;
    this.maxFrames = image.maxFrames;
    this.currentFrame = 0;
    this.timeElapsed = 0;
    this.timeHold = 5;
  }

  draw() {
    c.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.maxFrames),
      0,
      this.image.width / this.maxFrames,
      this.image.height,
      this.position.x + this.offset.x,
      this.position.y + this.offset.y,
      (this.image.width / this.maxFrames) * this.scale,
      this.image.height * this.scale
    );
  }
  update() {
    this.draw();

    this.animateFrames();

    if (this.isAttacking) {
      c.fillStyle = "blue";
    }
  }

  animateFrames() {
    this.timeElapsed++;

    if (this.timeElapsed % this.timeHold === 0) {
      if (this.maxFrames - 1 > this.currentFrame) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }

  attack() {
    this.isAttacking = true;
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    offset = {
      x: 0,
      y: 0,
    },
    image,
    sprites,
    attackBox = {
      offset: {
        x: 0,
        y: 0,
      },
      position: {
        x: 0,
        y: 0,
      },
      width: 100,
      height: 50,
    },
  }) {
    super({
      position,
      offset,
      image,
    });
    this.position = position;
    this.offset = offset;
    this.sprites = sprites;
    this.attackBox = attackBox;
    this.attackBox.position = position;

    for (const sprite in sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].src;
    }
  }

  update() {
    this.draw();

    // attack box
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );
    this.animateFrames();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    if (this.position.y < canvas.height - this.image.height - this.velocity.y) {
      this.velocity.y += gravity;
    } else {
      // this.position.y = 330;
      this.velocity.y = 0;
    }
  }

  switchSprite(sprite) {
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.maxFrames = this.sprites.idle.maxFrames;
          this.currentFrame = 0;
        }

        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.maxFrames = this.sprites.run.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.maxFrames = this.sprites.jump.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.maxFrames = this.sprites.fall.maxFrames;
          this.currentFrame = 0;
        }

        break;
      case "attack":
        if (this.image !== this.sprites.attack.image) {
          this.image = this.sprites.attack.image;
          this.maxFrames = this.sprites.attack.maxFrames;
          this.currentFrame = 0;
        }
        break;
    }
  }
}
