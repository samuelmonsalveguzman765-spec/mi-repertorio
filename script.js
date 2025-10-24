// Bad Time — Mini Simulator (simple, fan-style)
// Controles: Flechas o WASD. P para pausar, R para reiniciar.

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hpEl = document.getElementById('hp');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const btnPause = document.getElementById('btnPause');
const btnRestart = document.getElementById('btnRestart');

let W = canvas.width, H = canvas.height;

const state = {
  running: true,
  lastTime: performance.now(),
  elapsed: 0,
  hp: 10,
  score: 0,
  bullets: [],
  spawnTimer: 0,
  player: {x: W/2, y: H - 70, r: 10, speed: 200},
  keys: {}
};

// --- Controles ---
window.addEventListener('keydown', e=>{
  state.keys[e.key.toLowerCase()] = true;
  if(e.key.toLowerCase()==='p') togglePause();
  if(e.key.toLowerCase()==='r') restart();
});
window.addEventListener('keyup', e=> state.keys[e.key.toLowerCase()] = false);
btnPause.addEventListener('click', togglePause);
btnRestart.addEventListener('click', restart);

function togglePause(){
  state.running = !state.running;
  btnPause.textContent = state.running ? 'Pausa' : 'Reanudar';
  if(state.running){ state.lastTime = performance.now(); requestAnimationFrame(loop); }
}

function restart(){
  state.hp = 10; state.elapsed = 0; state.score = 0;
  state.bullets = []; state.spawnTimer = 0;
  state.player.x = W/2; state.player.y = H - 70;
  state.running = true; btnPause.textContent='Pausa';
  updateHUD(); state.lastTime = performance.now();
  requestAnimationFrame(loop);
}

// --- Creación de balas ---
function spawnBullet(x,y,vx,vy,type='round'){
  state.bullets.push({x,y,vx,vy,r:type==='round'?6:8,type,t:0});
}

function spawnWave(){
  const cx = W/2, cy = 80;
  const count = 14;
  for(let i=0;i<count;i++){
    const a = (i/count)*Math.PI*2 + Math.random()*0.1;
    const speed = 90 + Math.random()*80;
    spawnBullet(cx,cy,Math.cos(a)*speed,Math.sin(a)*speed);
  }
}

function spawnFallingBones(){
  const cols = 6;
  for(let i=0;i<cols;i++){
    const x = 80 + i*((W-160)/(cols-1));
    spawnBullet(x, -10, 0, 120 + Math.random()*60, 'bone');
  }
}

function spawnHoming(){
  const sides = 6;
  for(let i=0;i<sides;i++){
    const y = 50 + Math.random()*30;
    const x = (i%2===0)? -10 : W+10;
    const angle = Math.atan2((H/2)-y, (W/2)-x);
    const speed = 60 + Math.random()*40;
    spawnBullet(x,y, Math.cos(angle)*speed, Math.sin(angle)*speed);
  }
}

// --- Actualización ---
function update(dt){
  if(!state.running) return;
  state.elapsed += dt;
  state.spawnTimer += dt;

  const difficulty = 1 + Math.floor(state.elapsed / 12);
  if(state.spawnTimer > Math.max(0.6 - difficulty*0.05, 0.18)){
    const p = Math.random();
    if(p < 0.45) spawnWave();
    else if(p < 0.75) spawnFallingBones();
    else spawnHoming();
    state.spawnTimer = 0;
  }

  // movimiento jugador
  const pl = state.player;
  let dx = 0, dy = 0;
  if(state.keys['arrowleft'] || state.keys['a']) dx -= 1;
  if(state.keys['arrowright'] || state.keys['d']) dx += 1;
  if(state.keys['arrowup'] || state.keys['w']) dy -= 1;
  if(state.keys['arrowdown'] || state.keys['s']) dy += 1;
  if(dx!==0 || dy!==0){
    const len = Math.hypot(dx,dy);
    pl.x += (dx/len)*pl.speed*dt;
    pl.y += (dy/len)*pl.speed*dt;
  }
  pl.x = Math.max(12, Math.min(W-12, pl.x));
  pl.y = Math.max(12, Math.min(H-12, pl.y));

  // balas
  for(let i=state.bullets.length-1;i>=0;i--){
    const b = state.bullets[i];
    b.t += dt;
    b.x += b.vx*dt;
    b.y += b.vy*dt;
    if(b.x < -40 || b.x > W+40 || b.y < -60 || b.y > H+60) state.bullets.splice(i,1);
  }

  // colisiones
  for(let i=state.bullets.length-1;i>=0;i--){
    const b = state.bullets[i];
    const dx = b.x - pl.x, dy = b.y - pl.y;
    const dist = Math.hypot(dx,dy);
    if(dist < b.r + pl.r){
      state.bullets.splice(i,1);
      state.hp = Math.max(0, state.hp - 1);
      if(state.hp === 0){ state.running = false; }
    }
  }

  state.score = Math.floor(state.elapsed*10);
  updateHUD();
}

// --- HUD ---
function updateHUD(){
  hpEl.textContent = state.hp;
  timeEl.textContent = state.elapsed.toFixed(2);
  scoreEl.textContent = state.score;
}

// --- Dibujar ---
function draw(){
  ctx.clearRect(0,0,W,H);
  for(const b of state.bullets){
    ctx.beginPath();
    ctx.fillStyle = b.type==='bone' ? '#dfe7ee' : '#ff8b8b';
    ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.fillStyle = '#ffffff';
  ctx.arc(state.player.x,state.player.y,state.player.r,0,Math.PI*2);
  ctx.fill();

  if(!state.running){
    ctx.fillStyle='rgba(0,0,0,0.6)';
    ctx.fillRect(0,H/2-40,W,90);
    ctx.fillStyle='#fff';
    ctx.font='22px system-ui';
    ctx.textAlign='center';
    ctx.fillText('Game Over — Presiona R para reiniciar',W/2,H/2+10);
  }
}

// --- Bucle principal ---
function loop(ts){
  const dt = Math.min((ts - state.lastTime)/1000, 0.05);
  state.lastTime = ts;
  update(dt);
  draw();
  if(state.running) requestAnimationFrame(loop);
}
state.lastTime = performance.now();
requestAnimationFrame(loop);
