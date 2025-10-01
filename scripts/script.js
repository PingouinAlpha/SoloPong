const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height / 2 + 150;
let dx = randomDirection();
let dy = -3;
let rafId;
let rx = canvas.width / 2 - 50
let ry = canvas.height - 20
let rebond = 0;
let meilleurScore = 0;
let moveLeftBtn = document.getElementById('moveLeft');
let moveRightBtn = document.getElementById('moveRight');

moveLeftBtn.addEventListener('mousedown', () => {
    if (rx > 0) {
        rx -= 20;
    }
});

moveLeftBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (rx > 0) {
        rx -= 20;
    }
});

moveRightBtn.addEventListener('mousedown', () => {
    if (rx < canvas.width - 100) {
        rx += 20;
    }
});

moveRightBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (rx < canvas.width - 100) {
        rx += 20;
    }
});

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
    ctx.fillStyle = "cyan";
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
const audio = new Audio("/audio.mp3");
const sonFond = new Audio("/sonAmbiance.mp3");

function playSon() {
    audio.pause()
    audio.currentTime = 0;
    audio.play();
}

function testNegatif(n) {
    if(n < 0) {
        return true;
    } else {
        return false;
    }
}

function update() {
    x += dx;
    y += dy;
    if (y < 15) {
        dy = -dy;
        dx += (Math.random() - 0.5) * 2;
        if (Math.abs(dx) < 2) {
            dx = dx < 0 ? -2 : 2;
        }
        if (Math.abs(dx) > 6) {
                dx = dx < 0 ? -6 : 6;
            }
        rebond++;
        playSon()
    }
    if (x < 15 || x > canvas.width - 15) {
        dx = -dx;
        dy += (Math.random() - 0.5) * 2;
        rebond++;
        playSon()
    }
    if (y + 15 > ry && x > rx && x < rx + 100) {
        dy = -dy;
            dx += (Math.random() - 0.5) * 2;
            if (Math.abs(dx) < 2) {
                dx = dx < 0 ? -2 : 2;
            }
            if (Math.abs(dx) > 6) {
                dx = dx < 0 ? -6 : 6;
            }
        rebond++;
        playSon()
    }
    if (y > canvas.height - 15) finJeu();
    if(rebond < 5) {
        if (testNegatif(dx) == true) {
            dx -= rebond*0.004;
        }
        if (testNegatif(dx) == false) {
            dx += rebond*0.004;
        }
        if (testNegatif(dy) == true) {
            dy -= rebond*0.004;
        }
        if (testNegatif(dy) == false) {
            dy += rebond*0.004;
        }
    }
}

function loop() {
    update();
    drawBall();
    drawBar();
    rafId = requestAnimationFrame(loop); 
}

function finJeu() {
    cancelAnimationFrame(rafId);
    x = canvas.width / 2;
    y = canvas.height / 2 + 150;
    dx = 0;
    dy = 0;
    rx = canvas.width / 2 - 50;
    ry = canvas.height - 20;
    score = 0;
    rebond = 0;
    sonFond.pause();
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
            if (score > meilleurScore) {
                meilleurScore = score;
                document.getElementById('bestScore').innerText = `Meilleur Score: ${meilleurScore}s`;
            }
        } else {
            score = 0;
        }
    }, 1000);
}

drawBall();
drawBar();
document.addEventListener("keydown", moveBar);
let demarerAnimation = document.getElementById('start');
demarerAnimation.addEventListener('click', () => {
    cancelAnimationFrame(rafId);
    dx = randomDirection();
    x = canvas.width / 2;
    y = canvas.height / 2 + 150;
    dy = -3;
    rebond = 0;
    rafId = requestAnimationFrame(loop);
    startScore();
    sonFond.currentTime = 0;
    sonFond.loop = true;
    sonFond.play();
})

let resetAnimation = document.getElementById('reset');
resetAnimation.addEventListener('click', () => {
    x = canvas.width / 2;
    y = canvas.height / 2 + 150;
    dx = 0;
    dy = 0;
    rebond = 0;
    sonFond.pause();
    drawBall();
    clearInterval(scoreInterval);
    document.getElementById('temps').innerText = `Score: 0s`;
})
