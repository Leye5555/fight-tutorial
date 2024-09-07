const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d"); // set context to 2d;

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;

let gameEnd = false;

c.fillRect(0, 0, canvas.width, canvas.height);

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

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: {
    src: "./assets/background.png",
    width: canvas.width,
    height: canvas.height,
    scale: 1,
    maxFrames: 1,
  },
});

const shop = new Sprite({
  position: {
    x: canvas.width - 300,
    y: canvas.height - 300,
  },
  offset: {
    x: -110,
    y: -147,
  },
  image: {
    src: "./assets/shop.png",
    scale: 2.75,
    maxFrames: 6,
  },
});

const player = new Fighter({
  position: { x: 0, y: 0 },
  offset: {
    x: 100,
    y: -200,
  },

  image: {
    src: "./assets/samuraiMack/Idle.png",
    maxFrames: 8,
    scale: 2.5,
  },
  sprites: {
    idle: {
      src: "./assets/samuraiMack/Idle.png",
      maxFrames: 8,
    },
    run: {
      src: "./assets/samuraiMack/Run.png",
      maxFrames: 8,
    },
    jump: {
      src: "./assets/samuraiMack/Jump.png",
      maxFrames: 2,
    },
    fall: {
      src: "./assets/samuraiMack/Fall.png",
      maxFrames: 2,
    },
  },
});

const enemy = new Fighter({
  position: { x: 500, y: 0 },
  offset: {
    x: 100,
    y: -215,
  },
  image: {
    src: "./assets/kenji/Idle.png",
    scale: 2.5,
    maxFrames: 4,
  },
  sprites: {
    idle: {
      src: "./assets/Kenji/Idle.png",
      maxFrames: 4,
    },
    run: {
      src: "./assets/Kenji/Run.png",
      maxFrames: 8,
    },
    jump: {
      src: "./assets/kenji/Jump.png",
      maxFrames: 2,
    },
    fall: {
      src: "./assets/Kenji/Fall.png",
      maxFrames: 2,
    },
  },
});

let timeout = null;
let gameDuration = 60;

let uniqueId = setInterval(determineWinner, 1000);

function animate() {
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  window.requestAnimationFrame(animate);
  background.update();
  shop.update();
  player.update();
  enemy.update();
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }
  //player jump
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  } else {
    player.switchSprite("idle");
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  //enemy jump
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  } else {
    enemy.switchSprite("idle");
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
      clearInterval(uniqueId);
      document.querySelector(".game-status").textContent = "Player 2 Wins";
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
      clearInterval(uniqueId);
      document.querySelector(".game-status").textContent = "Player 1 Wins";
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
      player.velocity.y = -15;

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
      enemy.velocity.y = -15;

      break;
  }
});

window.addEventListener("keyup", function (event) {
  //player interaction
  switch (event.key) {
    case "a":
      keys.a.pressed = false;
      player.switchSprite("idle");

      break;
    case "d":
      keys.d.pressed = false;
      player.switchSprite("idle");

      break;
  }

  // enemy interaction
  switch (event.key) {
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      enemy.switchSprite("idle");

      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      enemy.switchSprite("idle");

      break;
  }
});
