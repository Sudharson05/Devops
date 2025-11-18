const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width; const H = canvas.height;

// Game state
let running = true;
let gameOver = false;
let score = 0;
let highScore = 0;

// Dino
const dino = {
  x: 60,
  y: H - 52,
  w: 40,
  h: 40,
  vy: 0,
  grounded: true
};

const gravity = 0.9;
const jumpPower = -15;

// Obstacles
const obstacles = [];
let spawnTimer = 0;
let spawnInterval = 1200; // ms
let speed = 6;

let lastTime = performance.now();

function resetGame() {
  obstacles.length = 0;
  dino.y = H - 52; dino.vy = 0; dino.grounded = true;
  score = 0; spawnTimer = 0; spawnInterval = 1200; speed = 6; gameOver = false; running = true; lastTime = performance.now();
}

function jump() {
  if (gameOver) { resetGame(); return; }
  if (dino.grounded) {
    dino.vy = jumpPower;
    dino.grounded = false;
  }
}

function spawnObstacle() {
  const height = 20 + Math.random() * 40;
  const w = 20 + Math.random() * 20;
  obstacles.push({ x: W + 20, y: H - 20 - height, w: w, h: height });
}

function update(dt) {
  if (gameOver) return;

  // Dino physics
  dino.vy += gravity * (dt/16);
  dino.y += dino.vy * (dt/16);
  if (dino.y + dino.h >= H - 12) {
    dino.y = H - 12 - dino.h;
    dino.vy = 0;
    dino.grounded = true;
  }

  // Spawn obstacles
  spawnTimer += dt;
  if (spawnTimer > spawnInterval) {
    spawnTimer = 0;
    spawnInterval = 800 + Math.random() * 1200; // vary spawn
    spawnObstacle();
  }

  // Move obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= speed * (dt/16);
    if (obstacles[i].x + obstacles[i].w < -50) obstacles.splice(i,1);
  }

  // Collision
  for (const ob of obstacles) {
    if (rectIntersect(dino.x, dino.y, dino.w, dino.h, ob.x, ob.y, ob.w, ob.h)) {
      gameOver = true; running = false; if (score > highScore) highScore = score; break;
    }
  }

  // Score & difficulty
  score += Math.floor(dt * 0.01);
  if (score % 1000 === 0) speed += 0.002 * dt; // slowly increase speed
}

function rectIntersect(x1,y1,w1,h1,x2,y2,w2,h2){
  return !(x2 > x1 + w1 || x2 + w2 < x1 || y2 > y1 + h1 || y2 + h2 < y1);
}

function draw() {
  // clear
  ctx.fillStyle = '#fff';
  ctx.fillRect(0,0,W,H);

  // ground
  ctx.fillStyle = '#888';
  ctx.fillRect(0, H-12, W, 12);

  // dino
  ctx.fillStyle = '#222';
  ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
  // eye
  ctx.fillStyle = '#fff'; ctx.fillRect(dino.x + dino.w - 12, dino.y + 8, 6, 6);

  // obstacles
  ctx.fillStyle = '#333';
  for (const ob of obstacles) ctx.fillRect(ob.x, ob.y, ob.w, ob.h);

  // score
  ctx.fillStyle = '#111'; ctx.font = '16px system-ui, Arial';
  ctx.fillText('Score: ' + Math.floor(score/10), 12, 22);
  ctx.fillText('High: ' + Math.floor(highScore/10), W - 110, 22);

  if (gameOver) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillRect(W/2 - 160, H/2 - 40, 320, 80);
    ctx.fillStyle = '#222';
    ctx.font = '20px system-ui, Arial';
    ctx.fillText('Game Over — Press Space or Click to Restart', W/2 - 260/2, H/2);
  }
}

function loop(now) {
  const dt = Math.min(40, now - lastTime);
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

// Input
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); }
});
window.addEventListener('mousedown', (e) => { jump(); });
window.addEventListener('touchstart', (e) => { e.preventDefault(); jump(); }, {passive:false});

// Start
resetGame();
requestAnimationFrame(loop);
