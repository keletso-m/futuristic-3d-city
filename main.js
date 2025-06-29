// main.js
import * as THREE              from 'three';
import { OrbitControls }      from 'three/examples/jsm/controls/OrbitControls.js';

// ———————————————————————————————————————————
// Scene, Camera, Renderer
// ———————————————————————————————————————————
const scene    = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera   = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(30, 20, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;                     // ← shadows on
renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// ———————————————————————————————————————————
// Controls
// ———————————————————————————————————————————
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping    = true;
controls.dampingFactor    = 0.05;
controls.maxPolarAngle    = Math.PI / 2;

// ———————————————————————————————————————————
// Lights & Shadows
// ———————————————————————————————————————————
// Soft fill light
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
hemi.position.set(0, 200, 0);
scene.add(hemi);

// Sunlight with shadows
const sun = new THREE.DirectionalLight(0xffffff, 0.8);
sun.position.set(50, 100, 50);
sun.castShadow = true;
sun.shadow.camera.top    = 50;
sun.shadow.camera.bottom = -50;
sun.shadow.camera.left   = -50;
sun.shadow.camera.right  = 50;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);

// ———————————————————————————————————————————
// Ground
// ———————————————————————————————————————————
const groundGeo = new THREE.PlaneGeometry(200, 200);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
const ground    = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x    = -Math.PI / 2;
ground.receiveShadow = true;                          // ← ground gets shadows
scene.add(ground);

// ———————————————————————————————————————————
// Buildings
// ———————————————————————————————————————————
const buildingGeo = new THREE.BoxGeometry(2, 1, 2);
const buildingMat = new THREE.MeshStandardMaterial({ color: 0x00ffcc });

for (let i = 0; i < 12; i++) {
  const height   = Math.random() * 15 + 5;
  const building = new THREE.Mesh(
    buildingGeo.clone(),
    buildingMat.clone()
  );

  building.scale.y  = height;
  building.position.set(
    (Math.random() - 0.5) * 100,
    height / 2,
    (Math.random() - 0.5) * 100
  );
  building.material.color.setHex(Math.random() * 0xffffff);

  building.castShadow    = true;   // ← buildings cast shadows
  building.receiveShadow = false;
  scene.add(building);
}

// ———————————————————————————————————————————
// Cars Placeholders
// ———————————————————————————————————————————
const carGeo = new THREE.BoxGeometry(1, 0.5, 2);
let cars = [];

for (let i = 0; i < 4; i++) {
  const car = new THREE.Mesh(carGeo, new THREE.MeshStandardMaterial({ color: 0xff0000 }));
  car.position.set(i * 3 - 6, 0.25, -20);
  car.castShadow = true;           // ← cars cast shadows
  scene.add(car);
  cars.push(car);
}

// ———————————————————————————————————————————
// Drones Placeholders
// ———————————————————————————————————————————
const droneGeo = new THREE.SphereGeometry(0.5, 16, 16);
let drones = [];

for (let i = 0; i < 4; i++) {
  const drone = new THREE.Mesh(droneGeo, new THREE.MeshStandardMaterial({ color: 0x00ff00 }));
  drone.position.set(i * 4 - 8, 8, -5);
  drone.castShadow = true;         // ← drones cast shadows
  scene.add(drone);
  drones.push(drone);
}

// ———————————————————————————————————————————
// Animation Logic
// ———————————————————————————————————————————
let carsMoving   = true;
let dronesRotating = true;

document.addEventListener('keydown', (e) => {
  if (e.key === 'c') carsMoving    = !carsMoving;
  if (e.key === 'd') dronesRotating = !dronesRotating;
});

function animate() {
  requestAnimationFrame(animate);

  if (carsMoving) {
    cars.forEach(car => {
      car.position.x += 0.05;
      if (car.position.x > 20) car.position.x = -20;
    });
  }

  if (dronesRotating) {
    drones.forEach(drone => {
      drone.rotation.y += 0.05;
    });
  }

  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
