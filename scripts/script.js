const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height / 2;
let dx = randomDirection();
let dy = -3;
let rafId;
let rx = canvas.width / 2 - 50
let ry = canvas.height - 20

function randomDirection() {
    return Math.random() < 0.5 ? 3 : -3;
}

function drawBall() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "cyan";
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
}

function drawBar() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(rx, ry, 100, 10);
}

function moveBar() {
    let direction = event.key;
    if (direction === "ArrowLeft" && rx > 0) {
        rx -= 20;
    }
    if (direction === "ArrowRight" && rx < canvas.width - 100) {
        rx += 20;
    }
}

function update() {
    x += dx;
    y += dy;
    if (y < 15) {
        dy = -dy;
        dx += (Math.random() - 0.5) * 2;
    }
    if (x < 15 || x > canvas.width - 15) {
        dx = -dx;
        dy += (Math.random() - 0.5) * 2;
    }
    if (y + 15 > ry && x > rx && x < rx + 100) {
        dy = -dy;
        dx += (Math.random() - 0.5) * 2;
    }
    if (y > canvas.height - 15) finJeu();
}

function loop() {
    update();
    drawBall();
    drawBar();
    rafId = requestAnimationFrame(loop); // planifie la prochaine frame
}

function finJeu() {
    cancelAnimationFrame(rafId);
    x = canvas.width / 2;
    y = canvas.height / 2;
    dx = 0;
    dy = 0;
    rx = canvas.width / 2 - 50;
    ry = canvas.height - 20;
    score = 0;
    drawBall();
    clearInterval(scoreInterval);
    document.getElementById('temps').innerText = `Score: 0s`;
    alert("Game Over");
}

let scoreInterval;
function startScore() {
    let score = 0;
    if (scoreInterval) {
        clearInterval(scoreInterval);
    }
    scoreInterval = setInterval(() => {
        if (rafId) {
            score++;
            document.getElementById('temps').innerText = `Score: ${score}s`;
        } else {
            score = 0;
        }
    }, 1000);
}

drawBall();
drawBar();
document.addEventListener("keydown", moveBar);
// démarrer l'animation
let demarerAnimation = document.getElementById('start');
demarerAnimation.addEventListener('click', () => {
    dx = randomDirection();
    dy = -3;
    rafId = requestAnimationFrame(loop);
    startScore();
})

// possibilité d'arrêter l'animation avec le bouton 'stop'
let stopAnimation = document.getElementById('pause');
stopAnimation.addEventListener('click', () => {
    cancelAnimationFrame(rafId)
})

let resetAnimation = document.getElementById('reset');
resetAnimation.addEventListener('click', () => {
    x = canvas.width / 2;
    y = canvas.height / 2;
    dx = 0;
    dy = 0;
    drawBall();
    startScore();
})