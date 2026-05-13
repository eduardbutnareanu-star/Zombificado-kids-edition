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

function createTree(x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 5),
    new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  );

  trunk.position.set(x, 2.5, z);

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(3),
    new THREE.MeshStandardMaterial({ color: 0x228B22 })
  );

  leaves.position.set(x, 7, z);

  scene.add(trunk);
  scene.add(leaves);
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

  if (keys['arrowright'] || keys['d']) {
    player.position.x += 0.5;
  }

 camera.position.x = player.position.x;
 camera.position.z = player.position.z + 20;

  camera.lookAt(player.position);

  renderer.render(scene, camera);
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
