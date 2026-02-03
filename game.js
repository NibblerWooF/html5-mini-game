const $ = (id) => document.getElementById(id);

const timeEl = $("time");
const scoreEl = $("score");
const startBtn = $("start");
const target = $("target");
const hint = $("hint");
const board = document.querySelector(".board");

let running = false;
let score = 0;
let tLeft = 30.0;
let lastTs = 0;
let raf = 0;

function setHint(text) { hint.textContent = text; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function moveTargetRandom() {
  const bw = board.clientWidth;
  const bh = board.clientHeight;

  const size = target.offsetWidth;
  const pad = 16;

  const minX = pad + size / 2;
  const maxX = bw - pad - size / 2;
  const minY = pad + size / 2;
  const maxY = bh - pad - size / 2;

  const x = Math.random() * (maxX - minX) + minX;
  const y = Math.random() * (maxY - minY) + minY;

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
}

function reset() {
  running = false;
  score = 0;
  tLeft = 30.0;
  lastTs = 0;
  scoreEl.textContent = "0";
  timeEl.textContent = tLeft.toFixed(1);
  target.disabled = true;
  startBtn.textContent = "开始";
  setHint("点击「开始」进入 30 秒挑战");
  cancelAnimationFrame(raf);
  moveTargetRandom();
}

function start() {
  running = true;
  score = 0;
  tLeft = 30.0;
  lastTs = performance.now();
  scoreEl.textContent = "0";
  target.disabled = false;
  startBtn.textContent = "重开";
  setHint("开始！尽量多点");
  moveTargetRandom();
  raf = requestAnimationFrame(tick);
}

function end() {
  running = false;
  target.disabled = true;
  setHint(`结束！你的得分：${score}（点「重开」再来）`);
}

function tick(ts) {
  if (!running) return;

  const dt = (ts - lastTs) / 1000;
  lastTs = ts;

  tLeft = clamp(tLeft - dt, 0, 30);
  timeEl.textContent = tLeft.toFixed(1);

  if (tLeft <= 0) {
    end();
    return;
  }
  raf = requestAnimationFrame(tick);
}

startBtn.addEventListener("click", () => start());

target.addEventListener("click", () => {
  if (!running) return;
  score += 1;
  scoreEl.textContent = String(score);
  moveTargetRandom();
});

window.addEventListener("resize", moveTargetRandom);

reset();
