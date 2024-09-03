const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d"); // set context to 2d;

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;

let gameEnd = false;

c.fillRect(0, 0, canvas.width, canvas.height);

//definition
class Sprite {
  constructor({
    position,
    offset = {
      x: 0,
      y: 0,
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
    this.isAttacking = false;
    this.health = 100;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, 50, 100);
  }
  update() {
    this.draw();

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    // attack box
    this.attackBox.x = this.position.x + this.offset.x;
    this.attackBox.y = this.position.y + this.offset.y;

    if (this.isAttacking) {
      c.fillStyle = "blue";

      c.fillRect(
        this.attackBox.x,
        this.attackBox.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }

    if (this.position.y < canvas.height - this.height - this.velocity.y) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }
  }

  attack() {
    this.isAttacking = true;
  }
}

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

// usage

const player = new Sprite({ position: { x: 0, y: 0 } });

const enemy = new Sprite({
  position: { x: 500, y: 0 },
  offset: {
    x: -50,
    y: 0,
  },
});

function detectCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.attackBox.x &&
    rectangle1.position.x <=
      rectangle2.attackBox.x + rectangle2.attackBox.width &&
    rectangle2.attackBox.y + rectangle2.attackBox.height >
      rectangle1.position.y &&
    rectangle2.attackBox.y <= rectangle1.position.y + rectangle1.height
  );
}

let timeout = null;

function animate() {
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  window.requestAnimationFrame(animate);
  player.update();
  enemy.update();
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  // detect collision

  // enemy attack
  if (
    detectCollision({ rectangle1: player, rectangle2: enemy }) &&
    enemy.isAttacking &&
    !gameEnd
  ) {
    enemy.isAttacking = false;
    player.health -= 10;
    if (player.health <= 0) {
      gameEnd = true;
    }
    document.querySelector(".player-health > .current-health").style.width =
      player.health + "%";
    console.log("enemy attacked");
  }

  // enemy misses
  if (enemy.isAttacking) {
    enemy.isAttacking = false;
  }

  // player attack
  if (
    detectCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    !gameEnd
  ) {
    player.isAttacking = false;
    enemy.health -= 10;
    if (enemy.health <= 0) {
      gameEnd = true;
    }
    document.querySelector(".enemy-health > .current-health").style.width =
      enemy.health + "%";
    console.log("player attacked");
  }

  // player misses

  if (player.isAttacking) {
    player.isAttacking = false;
  }
}

animate();

window.addEventListener("keydown", function (event) {
  // player interaction
  switch (event.key) {
    case "a":
      keys.a.pressed = true;
      player.lastKey = event.key;
      break;
    case "d":
      keys.d.pressed = true;
      player.lastKey = event.key;
      break;
    case "w":
      keys.w.pressed = true;
      player.velocity.y = -10;
      break;
    case " ":
      player.attack();
      break;
  }

  // enemy interaction
  switch (event.key) {
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = event.key;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = event.key;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
    case "ArrowUp":
      enemy.velocity.y = -10;
      break;
  }
});

window.addEventListener("keyup", function (event) {
  //player interaction
  switch (event.key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }

  // enemy interaction
  switch (event.key) {
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;

      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
  }
});
