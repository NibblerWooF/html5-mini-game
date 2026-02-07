const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

const speedInput = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");
const toggleBtn = document.getElementById("toggle");
const resetBtn = document.getElementById("reset");

let running = true;
let speedScale = Number(speedInput.value);
let cameraZoom = 1;
let animationId = 0;

const center = { x: canvas.width / 2, y: canvas.height / 2 };
const stars = Array.from({ length: 260 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.6 + 0.2,
  a: Math.random() * 0.7 + 0.2,
}));

const planets = [
  { name: "水星", radius: 7, orbit: 52, period: 0.24, color: "#b7b9c6", angle: Math.random() * Math.PI * 2 },
  { name: "金星", radius: 9, orbit: 80, period: 0.62, color: "#d6b47b", angle: Math.random() * Math.PI * 2 },
  { name: "地球", radius: 10, orbit: 112, period: 1, color: "#4da0ff", angle: Math.random() * Math.PI * 2 },
  { name: "火星", radius: 8, orbit: 148, period: 1.88, color: "#ff774d", angle: Math.random() * Math.PI * 2 },
  { name: "木星", radius: 20, orbit: 200, period: 11.86, color: "#f1c48a", angle: Math.random() * Math.PI * 2 },
  { name: "土星", radius: 18, orbit: 252, period: 29.46, color: "#e7d79f", angle: Math.random() * Math.PI * 2, ring: true },
  { name: "天王星", radius: 14, orbit: 300, period: 84.01, color: "#8bd7e8", angle: Math.random() * Math.PI * 2 },
  { name: "海王星", radius: 14, orbit: 340, period: 164.8, color: "#5f84ff", angle: Math.random() * Math.PI * 2 },
];

function drawBackground() {
  const gradient = ctx.createRadialGradient(center.x, center.y, 20, center.x, center.y, canvas.width * 0.7);
  gradient.addColorStop(0, "#16203b");
  gradient.addColorStop(0.4, "#090d1d");
  gradient.addColorStop(1, "#03040a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const s of stars) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${s.a})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSun() {
  const glow = ctx.createRadialGradient(center.x, center.y, 16, center.x, center.y, 72);
  glow.addColorStop(0, "#fff8c1");
  glow.addColorStop(0.4, "#ffd36b");
  glow.addColorStop(1, "rgba(255,186,58,0)");
  ctx.beginPath();
  ctx.fillStyle = glow;
  ctx.arc(center.x, center.y, 72, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "#ffb13d";
  ctx.arc(center.x, center.y, 24, 0, Math.PI * 2);
  ctx.fill();
}

function drawOrbit(orbit) {
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1;
  ctx.arc(center.x, center.y, orbit * cameraZoom, 0, Math.PI * 2);
  ctx.stroke();
}

function drawPlanet(p) {
  const x = center.x + Math.cos(p.angle) * p.orbit * cameraZoom;
  const y = center.y + Math.sin(p.angle) * p.orbit * cameraZoom;

  ctx.beginPath();
  ctx.fillStyle = p.color;
  ctx.arc(x, y, Math.max(4, p.radius * cameraZoom), 0, Math.PI * 2);
  ctx.fill();

  if (p.ring) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(232,217,170,0.7)";
    ctx.lineWidth = 2;
    ctx.ellipse(x, y, p.radius * 1.8 * cameraZoom, p.radius * 0.7 * cameraZoom, Math.PI / 9, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(226,236,255,0.86)";
  ctx.font = "12px system-ui";
  ctx.fillText(p.name, x + 12, y - 10);
}

function update(dt) {
  const yearSeconds = 8;
  for (const p of planets) {
    const speed = (Math.PI * 2) / (p.period * yearSeconds);
    p.angle += speed * dt * speedScale;
  }
}

function render() {
  drawBackground();
  drawSun();

  for (const p of planets) {
    drawOrbit(p.orbit);
    drawPlanet(p);
  }
}

let lastTime = performance.now();
function loop(ts) {
  const dt = (ts - lastTime) / 1000;
  lastTime = ts;

  if (running) update(dt);
  render();

  animationId = requestAnimationFrame(loop);
}

speedInput.addEventListener("input", () => {
  speedScale = Number(speedInput.value);
  speedValue.textContent = `${speedScale.toFixed(1)}x`;
});

toggleBtn.addEventListener("click", () => {
  running = !running;
  toggleBtn.textContent = running ? "暂停" : "继续";
});

resetBtn.addEventListener("click", () => {
  cameraZoom = 1;
  speedScale = 1;
  speedInput.value = "1";
  speedValue.textContent = "1.0x";
});

canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  const delta = Math.sign(event.deltaY);
  cameraZoom = Math.min(1.6, Math.max(0.5, cameraZoom - delta * 0.08));
}, { passive: false });

window.addEventListener("beforeunload", () => cancelAnimationFrame(animationId));

speedValue.textContent = `${speedScale.toFixed(1)}x`;
animationId = requestAnimationFrame(loop);
