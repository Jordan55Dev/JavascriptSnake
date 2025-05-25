let snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150},
];

let dx = 10;
let dy = 0;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function clearCanvas() {  
    ctx.fillStyle = "white";  
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);  
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lightgreen';
    ctx.strokeStyle = 'darkgreen';  // ✅ corrected here
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
    snake.forEach(drawSnakePart);  // ✅ no parameter needed
}

function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    snake.pop();
}

function changeDirection(event) { 
    const LEFT_KEY = 37; const RIGHT_KEY = 39;  const UP_KEY = 38;  const DOWN_KEY = 40; 

    const A_KEY = 65; const D_KEY = 68; const W_KEY = 87; const S_KEY = 83;

    const keyPressed = event.keyCode;  
    const goingUp = dy === -10;  
    const goingDown = dy === 10;  
    const goingRight = dx === 10;  
    const goingLeft = dx === -10;
        if ((keyPressed === LEFT_KEY || keyPressed === A_KEY) && !goingRight) {    dx = -10;    dy = 0;  }
        if ((keyPressed === UP_KEY || keyPressed === W_KEY) && !goingDown) {    dx = 0;    dy = -10;  }
        if ((keyPressed === RIGHT_KEY || keyPressed === D_KEY) && !goingLeft) {    dx = 10;    dy = 0;  }
        if ((keyPressed === DOWN_KEY || keyPressed === S_KEY) && !goingDown) {    dx = 0;    dy = 10;  }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw background and border
    clearCanvas();
    advanceSnake();
    drawSnake();

    document.addEventListener("keydown", changeDirection)
}

setInterval(gameLoop, 100);  // 10 FPS