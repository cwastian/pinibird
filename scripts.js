const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameInProgress = false;
let score = 0;
const lastScores = [];

const bird = {
  x: 50,
  y: canvas.height / 2,
  width: 85,
  height: 55,
  velocity: 0,
  gravity: 0.5,
  jump: -4,
  image: new Image(),
  gameOverImage: new Image(),
  draw: function () {
    const imageToDraw = gameInProgress ? this.image : this.gameOverImage;
    ctx.drawImage(imageToDraw, this.x, this.y, this.width, this.height);
  },
  flap: function () {
    this.velocity = this.jump;
    this.gravity += 0.05;
  },
  update: function () {
    this.velocity += this.gravity;
    this.y += this.velocity;
  },
  reset: function () {
    this.x = 50;
    this.y = canvas.height / 2;
    this.velocity = 0;
    this.gravity = 0.5;
    this.image = new Image();
    this.image.src = "pini.jpg";
  },
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
  bird.draw();
  drawScore();
  drawLastScores();
}

function update() {
  bird.update();
  if (bird.y + bird.height > canvas.height) {
    gameOver();
  }
  if (gameInProgress) {
    score += 1;
  }
}

function gameLoop() {
  if (gameInProgress) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

function startGame() {
  bird.reset();
  score = 0;
  gameInProgress = true;
  gameLoop();
}

function gameOver() {
  gameInProgress = false;
  bird.image = bird.gameOverImage;
  updateLastScores(score);
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, canvas.width - 150, 30);
}

function drawLastScores() {
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.textAlign = "right";
  for (let i = 0; i < lastScores.length; i++) {
    ctx.fillText(
      "Last " + (i + 1) + ": " + lastScores[i],
      canvas.width - 10,
      60 + i * 20
    );
  }
}

function updateLastScores(newScore) {
  if (lastScores.length >= 10) {
    lastScores.pop();
  }
  lastScores.unshift(newScore);
}

document.getElementById("retryButton").addEventListener("click", startGame);

document.addEventListener("keydown", function (event) {
  if (event.keyCode === 32 && bird.y > 0) {
    bird.flap();
    if (!gameInProgress) {
      startGame();
    }
  }
});

document.addEventListener("touchstart", function (event) {
  event.preventDefault();
  if (bird.y > 0) {
    bird.flap();
    if (!gameInProgress) {
      startGame();
    }
  }
});

const backgroundImg = new Image();
backgroundImg.src = "lake.jfif";
backgroundImg.onload = function () {
  bird.image.src = "pini.jpg";
  bird.gameOverImage.src = "grave.jpg";
  bird.image.onload = function () {};
  bird.gameOverImage.onload = function () {};
};
