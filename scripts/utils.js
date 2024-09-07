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

function determineWinner() {
  if (gameDuration > 0) {
    gameDuration--;
    document.querySelector(".timer").textContent = gameDuration;
  } else {
    if (player.health > enemy.health) {
      document.querySelector(".game-status").textContent = "Player 1 Wins";
    } else if (player.health < enemy.health) {
      document.querySelector(".game-status").textContent = "Player 2 Wins";
    } else {
      document.querySelector(".game-status").textContent = "It is a Tie";
    }
    clearInterval(uniqueId);
  }
}
