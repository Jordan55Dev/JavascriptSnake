let snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150},
];

let score = 0;

let dx = 10;
let dy = 0;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function drawGrid() {
    const gridSize = 10;
    ctx.strokeStyle = '#e0e0e0';  // Light grey grid lines
    ctx.lineWidth = 0.5;

    // Vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Horizontal lines
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

    // Draw border
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid();
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

function didGameEnd() {
    // Collision with self
    for (let i = 4; i < snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (didCollide) return true;
    }

    // Collision with walls
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function changeDirection(event) { 

    const keyPressed = event.key;  
    const goingUp = dy === -10;  
    const goingDown = dy === 10;  
    const goingRight = dx === 10;  
    const goingLeft = dx === -10;

    switch (event.key.toLowerCase()) {
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

function gameLoop() {
    if (didGameEnd()) {
        alert("Game Over! Your score: " + score);
        clearInterval(gameInterval); // Stop the game loop
        return;
    }
    
    // Redraw background and border
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();

    document.addEventListener("keydown", changeDirection)
}

const gameInterval = setInterval(gameLoop, 90); //9fps