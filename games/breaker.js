const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startOverlay = document.getElementById('start-overlay');
const gameOverOverlay = document.getElementById('game-over-overlay');
const winOverlay = document.getElementById('win-overlay');
const startGameBtn = document.getElementById('start-game-btn');
const restartGameBtn = document.getElementById('restart-game-btn');
const playAgainBtn = document.getElementById('play-again-btn');

// Game Variables
let ballRadius = 10;
let x, y, dx, dy;
let paddleHeight = 15;
let paddleWidth = 100;
let paddleX;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 4;
let brickColumnCount = 7;
let brickWidth = 90;
let brickHeight = 30;
let brickPadding = 15;
let brickOffsetTop = 50;
let brickOffsetLeft = 35;
let score = 0;
let lives = 3;
let isGameRunning = false;

// Custom brick labels
const brickLabels = [
    "Bias", "Gender Roles", "Pay Gap", "Stereotype", "Inequality", "Glass Ceiling", "Doubt",
    "Boy's Club", "Imposter", "No Funding", "Harassment", "Discrimination", "Fear", "Myths"
];

let bricks = [];

function initBricks() {
    bricks = [];
    let labelIndex = 0;
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            // Stronger bricks for top rows
            const status = r < 2 ? 2 : 1;
            const label = brickLabels[labelIndex % brickLabels.length];
            bricks[c][r] = { x: 0, y: 0, status: status, label: label };
            labelIndex++;
        }
    }
}

function resetGame() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 4;
    dy = -4;
    paddleX = (canvas.width - paddleWidth) / 2;
    score = 0;
    lives = 3;
    initBricks();
    isGameRunning = true;
    startOverlay.classList.add('hidden');
    gameOverOverlay.classList.add('hidden');
    winOverlay.classList.add('hidden');
    draw();
}

// Controls
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("touchmove", touchMoveHandler, { passive: false });

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function touchMoveHandler(e) {
    e.preventDefault();
    const relativeX = e.touches[0].clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status > 0) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status--;
                    score++;
                    // Win condition
                    if (score === brickRowCount * brickColumnCount + (brickRowCount > 2 ? brickRowCount * brickColumnCount : 0)) { // Simplified logic check
                        // Check if all bricks are cleared
                        let allCleared = true;
                        for (let i = 0; i < brickColumnCount; i++) {
                            for (let j = 0; j < brickRowCount; j++) {
                                if (bricks[i][j].status > 0) allCleared = false;
                            }
                        }
                        if (allCleared) {
                            isGameRunning = false;
                            winOverlay.classList.remove('hidden');
                        }
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#dd4760"; // Pink
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#160b2b"; // Dark Purple
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status > 0) {
                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                // Color based on status (strength)
                if (bricks[c][r].status === 2) {
                    ctx.fillStyle = "#ef4444"; // Red for hard bricks
                } else {
                    ctx.fillStyle = "#eab308"; // Yellow for normal bricks
                }
                ctx.fill();
                ctx.closePath();

                // Add text label
                ctx.fillStyle = "white";
                ctx.font = "10px Arial";
                ctx.textAlign = "center";
                ctx.fillText(bricks[c][r].label, brickX + brickWidth / 2, brickY + brickHeight / 2 + 4);
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#160b2b";
    ctx.textAlign = "left";
    ctx.fillText("Stereotypes Shattered: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#160b2b";
    ctx.textAlign = "right";
    ctx.fillText("Lives: " + lives, canvas.width - 8, 20);
}

function draw() {
    if (!isGameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    // Wall collision
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            // Add some English/spin based on where it hits the paddle
            const hitPoint = x - (paddleX + paddleWidth / 2);
            dx = hitPoint * 0.15;
        } else {
            lives--;
            if (!lives) {
                isGameRunning = false;
                gameOverOverlay.classList.remove('hidden');
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 4;
                dy = -4;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

// Button Events
startGameBtn.addEventListener('click', resetGame);
restartGameBtn.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', resetGame);

// Initial Render used for background
initBricks();
drawBricks();
drawPaddle();
ctx.font = "20px Arial";
ctx.fillStyle = "gray";
ctx.textAlign = "center";
ctx.fillText("Press Start to Play", canvas.width / 2, canvas.height / 2);
