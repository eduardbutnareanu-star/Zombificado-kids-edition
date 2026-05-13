import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.157/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 10, 20);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 1000),
  new THREE.MeshStandardMaterial({ color: 0x55aa55 })
);

ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const trees = [];

function createTree(x, z) {

  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 5),
    new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  );

  trunk.position.set(0, 2.5, 0);

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(3),
    new THREE.MeshStandardMaterial({ color: 0x228B22 })
  );

  leaves.position.set(0, 7, 0);

  tree.add(trunk);
  tree.add(leaves);

  tree.position.set(x, 0, z);

  scene.add(tree);

  trees.push(tree);
}

for (let i = 0; i < 100; i++) {
  createTree(
    (Math.random() - 0.5) * 800,
    (Math.random() - 0.5) * 800
  );
}

function createPlayer(color) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2, 4, 1),
    new THREE.MeshStandardMaterial({ color })
  );

  body.position.y = 4;

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(1),
    new THREE.MeshStandardMaterial({ color: 0xffcc99 })
  );

  head.position.y = 7;

  group.add(body);
  group.add(head);

  scene.add(group);

  return group;
}

const player = createPlayer(0x0000ff);

const keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

function animate() {
  requestAnimationFrame(animate);

  if (keys['arrowup'] || keys['w']) {
    player.position.z -= 0.5;
  }

  if (keys['arrowdown'] || keys['s']) {
    player.position.z += 0.5;
  }

  if (keys['arrowleft'] || keys['a']) {
    player.position.x -= 0.5;
  }

let speed = 0.5;

let newX = player.position.x;
let newZ = player.position.z;

if (keys['arrowup'] || keys['w']) {
  newZ -= speed;
}

if (keys['arrowdown'] || keys['s']) {
  newZ += speed;
}

if (keys['arrowleft'] || keys['a']) {
  newX -= speed;
}

if (keys['arrowright'] || keys['d']) {
  newX += speed;
}

if (!checkTreeCollision(newX, newZ)) {

  player.position.x = newX;
  player.position.z = newZ;

}

animate();
camera.position.x = player.position.x;
camera.position.y = player.position.y + 10;
camera.position.z = player.position.z + 15;

camera.lookAt(
  player.position.x,
  player.position.y + 5,
  player.position.z
);
// ===== RECOMPENSAS =====

let score = 0;

const scoreUI = document.createElement("div");
scoreUI.style.position = "absolute";
scoreUI.style.top = "10px";
scoreUI.style.right = "10px";
scoreUI.style.background = "white";
scoreUI.style.padding = "10px";
scoreUI.style.borderRadius = "10px";
scoreUI.innerHTML = "🏆 Puntos: 0";

document.body.appendChild(scoreUI);

function addPoints(points) {
  score += points;
  scoreUI.innerHTML = "🏆 Puntos: " + score;
}

// ===== PERSONAJE MEJORADO =====

function addBodyParts(player) {

  // BRAZO IZQUIERDO
  const armLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 3, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xffcc99 })
  );

  armLeft.position.set(-1.5, 4.5, 0);

  // BRAZO DERECHO
  const armRight = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 3, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xffcc99 })
  );

  armRight.position.set(1.5, 4.5, 0);

  // PIERNA IZQUIERDA
  const legLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 3, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );

  legLeft.position.set(-0.5, 1, 0);

  // PIERNA DERECHA
  const legRight = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 3, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );

  legRight.position.set(0.5, 1, 0);

  // OJOS VERDES
  const eyeLeft = new THREE.Mesh(
    new THREE.SphereGeometry(0.1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );

  eyeLeft.position.set(-0.3, 7.2, 0.9);

  const eyeRight = new THREE.Mesh(
    new THREE.SphereGeometry(0.1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );

  eyeRight.position.set(0.3, 7.2, 0.9);

  // LENGUA
  const tongue = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.6, 0.1),
    new THREE.MeshBasicMaterial({ color: 0xff0066 })
  );

  tongue.position.set(0, 6.4, 1);

  player.add(armLeft);
  player.add(armRight);
  player.add(legLeft);
  player.add(legRight);
  player.add(eyeLeft);
  player.add(eyeRight);
  player.add(tongue);
}

addBodyParts(player);

// ===== GANAR PUNTOS AL MOVERSE =====

setInterval(() => {
  addPoints(1);
}, 3000);
// ===== BOTS =====

const bots = [];

function createBot(x, z) {

  const bot = createPlayer(0xff0000);

  bot.position.set(x, 0, z);

  bots.push(bot);
}

for (let i = 0; i < 5; i++) {

  createBot(
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200
  );
}

// ===== COLISIONES =====

function checkTreeCollision(newX, newZ) {

  for (const tree of trees) {

    const dx = newX - tree.position.x;
    const dz = newZ - tree.position.z;

    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < 4) {
      return true;
    }
  }

  return false;
}

// ===== IA BOTS =====

function updateBots() {

  bots.forEach(bot => {

    const dx = player.position.x - bot.position.x;
    const dz = player.position.z - bot.position.z;

    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance > 2) {

      bot.position.x += dx * 0.003;
      bot.position.z += dz * 0.003;
    }

    // TOCAR AL JUGADOR
    if (distance < 2) {

      document.body.style.background = "darkred";

      setTimeout(() => {
        document.body.style.background = "";
      }, 300);
    }

  });

}
