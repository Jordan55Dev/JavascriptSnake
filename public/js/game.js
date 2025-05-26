let snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150},
];

let snakeColor = localStorage.getItem('snakeColor') || 'lightgreen';

document.getElementById('snakeColorSelect').value = snakeColor;

document.getElementById('snakeColorSelect').addEventListener('change', function () {
  snakeColor = this.value;
  localStorage.setItem('snakeColor', snakeColor);
});

let score = 0;

let dx = 10;
let dy = 0;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function drawGrid() {
    const gridSize = 10;
    ctx.strokeStyle = '#e0e0e0';  
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    drawGrid();
}

function drawSnakePart(snakePart) {
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = 'black';
  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;  
    if (didEatFood) {   
        score += 10;    
        document.getElementById('score').innerHTML = score; 
        createFood();  
    } 
    else {    
        snake.pop();  
    }
};

function changeDirection(event) {
    if (!event || !event.key) return;

    const keyPressed = event.key.toLowerCase();
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    switch (keyPressed) {
        case 'arrowleft':
        case 'a':
            if (!goingRight) { dx = -10; dy = 0; }
            break;
        case 'arrowup':
        case 'w':
            if (!goingDown) { dx = 0; dy = -10; }
            break;
        case 'arrowright':
        case 'd':
            if (!goingLeft) { dx = 10; dy = 0; }
            break;
        case 'arrowdown':
        case 's':
            if (!goingUp) { dx = 0; dy = 10; }
            break;
    }
}

function randomTen(min, max) {  return Math.round((Math.random() * (max-min) + min) / 10) * 10;}

function createFood() {
    foodX = randomTen(0, gameCanvas.width - 10);  
    foodY = randomTen(0, gameCanvas.height - 10);
    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY    
        if (foodIsOnSnake) createFood();
    });
};

function drawFood() { 
    ctx.fillStyle = 'red'; 
    ctx.strokestyle = 'darkred'; 
    ctx.fillRect(foodX, foodY, 10, 10); 
    ctx.strokeRect(foodX, foodY, 10, 10);
};

createFood();

function fetchLeaderboard() {
  fetch('/leaderboard')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('leaderboard');
      list.innerHTML = '';
      data.forEach(entry => {
        const item = document.createElement('li');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.innerHTML = `<strong>${entry.name}</strong> <span>${entry.score}</span>`;
        list.appendChild(item);
      });
    });
}

fetchLeaderboard();

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (didCollide) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

document.getElementById('gameOverForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('playerNameInput').value;
  fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, score })
  })
  .then(() => {
    fetchLeaderboard();
    bootstrap.Modal.getInstance(document.getElementById('gameOverModal')).hide();
    const playAgainModal = new bootstrap.Modal(document.getElementById('playAgainModal'));
    playAgainModal.show();
  });
});

document.addEventListener("keydown", changeDirection)

function gameLoop() {
    if (didGameEnd()) {
        clearInterval(gameInterval);
        const gameOverModal = new bootstrap.Modal(document.getElementById('gameOverModal'));
        document.getElementById('finalScoreDisplay').textContent = score;
        gameOverModal.show();
        return;
    }

    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();

}

document.getElementById('confirmRestartBtn').addEventListener('click', function () {
  bootstrap.Modal.getInstance(document.getElementById('playAgainModal')).hide();
  restartGame();
});

function restartGame() {
  snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150},
  ];
  dx = 10;
  dy = 0;
  score = 0;
  document.getElementById('startGameBtn').disabled = false;
  document.getElementById('score').innerHTML = score;
  createFood();
  if (typeof gameInterval !== 'undefined') clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 90);
}

let gameInterval;

document.getElementById('startGameBtn').addEventListener('click', () => {
  if (typeof gameInterval !== 'undefined') clearInterval(gameInterval); // prevent double start
  gameInterval = setInterval(gameLoop, 90); //9 fps
  document.getElementById('startGameBtn').disabled = true; // disable after start
});