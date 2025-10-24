const boardEl = document.getElementById("board");
const startBtn = document.getElementById("startBtn");
const rowsInput = document.getElementById("rows");
const colsInput = document.getElementById("cols");
const minesInput = document.getElementById("mines");
const minesLeftEl = document.getElementById("minesLeft");
const gameStateEl = document.getElementById("gameState");
const timerEl = document.getElementById("timer");

let rows = 8,
  cols = 8,
  mines = 10;
let grid = [];
let started = false,
  gameOver = false,
  timer = 0,
  timerInterval = null;
let flagsLeft = 0;

function Cell(r, c) {
  this.r = r;
  this.c = c;
  this.mine = false;
  this.revealed = false;
  this.flag = false;
  this.adj = 0;
  this.el = null;
}

function init() {
  rows = parseInt(rowsInput.value) || 8;
  cols = parseInt(colsInput.value) || 8;
  mines = parseInt(minesInput.value) || 10;
  flagsLeft = mines;
  minesLeftEl.textContent = flagsLeft;

  grid = [];
  boardEl.innerHTML = "";
  boardEl.style.gridTemplateColumns = `repeat(${cols}, var(--cell-size))`;

  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      const cell = new Cell(r, c);
      const btn = document.createElement("button");
      btn.className = "cell";
      btn.dataset.r = r;
      btn.dataset.c = c;
      btn.addEventListener("click", onLeftClick);
      btn.addEventListener("contextmenu", onRightClick);
      cell.el = btn;
      boardEl.appendChild(btn);
      grid[r][c] = cell;
    }
  }

  started = false;
  gameOver = false;
  timer = 0;
  clearInterval(timerInterval);
  timerEl.textContent = 0;
  gameStateEl.textContent = "Listo";
}

function placeMines(firstR, firstC) {
  const forbidden = new Set();
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      const rr = firstR + dr,
        cc = firstC + dc;
      if (rr >= 0 && rr < rows && cc >= 0 && cc < cols)
        forbidden.add(rr + "," + cc);
    }

  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (forbidden.has(r + "," + c)) continue;
    const cell = grid[r][c];
    if (!cell.mine) {
      cell.mine = true;
      placed++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      cell.adj = countAround(r, c, (rr, cc) => (grid[rr][cc].mine ? 1 : 0));
    }
  }
}

function countAround(r, c, fn) {
  let acc = 0;
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const rr = r + dr,
        cc = c + dc;
      if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) acc += fn(rr, cc);
    }
  return acc;
}

function onLeftClick(e) {
  if (gameOver) return;
  const r = parseInt(this.dataset.r),
    c = parseInt(this.dataset.c);
  const cell = grid[r][c];
  if (!started) {
    placeMines(r, c);
    started = true;
    gameStateEl.textContent = "Jugando...";
    timerInterval = setInterval(() => {
      timer++;
      timerEl.textContent = timer;
    }, 1000);
  }
  if (cell.flag || cell.revealed) return;
  revealCell(r, c);
  checkWin();
}

function onRightClick(e) {
  e.preventDefault();
  if (gameOver) return;
  const r = parseInt(this.dataset.r),
    c = parseInt(this.dataset.c);
  const cell = grid[r][c];
  if (cell.revealed) return;
  cell.flag = !cell.flag;
  if (cell.flag) {
    cell.el.classList.add("flag");
    cell.el.textContent = "⚑";
    flagsLeft--;
  } else {
    cell.el.classList.remove("flag");
    cell.el.textContent = "";
    flagsLeft++;
  }
  minesLeftEl.textContent = flagsLeft;
}

function revealCell(r, c) {
  const cell = grid[r][c];
  if (cell.revealed || cell.flag) return;
  cell.revealed = true;
  cell.el.classList.add("revealed");
  if (cell.mine) {
    cell.el.classList.add("mine");
    cell.el.textContent = "💣";
    endGame(false);
    return;
  }
  if (cell.adj > 0) {
    cell.el.textContent = cell.adj;
    cell.el.classList.add("num-" + cell.adj);
  } else {
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        const rr = r + dr,
          cc = c + dc;
        if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) {
          if (!grid[rr][cc].revealed) revealCell(rr, cc);
        }
      }
  }
}

function checkWin() {
  let revealedCount = 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (grid[r][c].revealed) revealedCount++;
  if (revealedCount === rows * cols - mines) endGame(true);
}

function endGame(win) {
  gameOver = true;
  clearInterval(timerInterval);
  gameStateEl.textContent = win ? "¡Ganaste! 🎉" : "Perdiste 💥";
  if (!win)
    grid.flat().forEach((cell) => {
      if (cell.mine) {
        cell.el.classList.add("mine");
        cell.el.textContent = "💣";
      }
    });
}

startBtn.addEventListener("click", init);
init();
