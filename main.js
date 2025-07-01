import * as THREE           from 'three';
import { OrbitControls }   from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let cars = [], drones = [];
let carsMoving = true, dronesRotating01 = true, dronesRotating23 = true;

init();
animate();

function init() {
  // Scene & Camera
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1e1e2e);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(40, 25, 40);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Lights
  const ambient = new THREE.AmbientLight(0x404050, 0.6);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffffff, 1.0);
  sun.position.set(50, 120, 50);
  sun.castShadow = true;
  const d = 200;
  sun.shadow.camera.left   = -d;
  sun.shadow.camera.right  =  d;
  sun.shadow.camera.top    =  d;
  sun.shadow.camera.bottom = -d;
  sun.shadow.camera.near   = 1;
  sun.shadow.camera.far    = 500;
  sun.shadow.mapSize.set(2048, 2048);
  scene.add(sun);

  // Ground
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x2a2d3e });
  const groundGeo = new THREE.PlaneGeometry(400, 400);
  const ground    = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x    = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Buildings (10 + 4 extra)
  createBuildings(10);

  // Cars & Drones
  spawnCars(4);
  spawnDrones(4);

  // Event Listeners
  window.addEventListener('resize', onResize);
  window.addEventListener('keydown', onKey);
}

function createBuildings(count) {
  // add a few more towers
  const total = count + 4;

  // Box, Pyramid (4-sided cone), Spire, Sphere
  const geos = [
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.ConeGeometry(1.5, 2, 4),
    new THREE.ConeGeometry(1.2, 2, 16),
    new THREE.SphereGeometry(1.2, 12, 12)
  ];

  for (let i = 0; i < total; i++) {
    const baseGeo = geos[i % geos.length].clone();

    // random height and wider base
    const height = THREE.MathUtils.randFloat(8, 40);
    const width  = THREE.MathUtils.randFloat(1.5, 3);
    baseGeo.scale(width, height, width);

    const hue  = Math.random() * 0.2 + 0.6;
    const mat  = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(hue, 0.5, 0.5)
    });
    const mesh = new THREE.Mesh(baseGeo, mat);
    mesh.castShadow = true;
    mesh.position.set(
      (i % 5 - 2) * 50 + THREE.MathUtils.randFloat(-5, 5),
      height / 2,
      (Math.floor(i / 5) - 1) * 60 + THREE.MathUtils.randFloat(-5, 5)
    );
    scene.add(mesh);
  }
}

function spawnCars(n) {
  const mat = new THREE.MeshStandardMaterial({ color: 0xff8c42 });
  for (let i = 0; i < n; i++) {
    const car = new THREE.Mesh(
      new THREE.BoxGeometry(4, 1.5, 2),
      mat.clone()
    );
    car.castShadow = true;
    car.userData.angle = (i / n) * Math.PI * 2;
    cars.push(car);
    scene.add(car);
  }
}

function spawnDrones(n) {
  const mat = new THREE.MeshStandardMaterial({ color: 0x72d6c9 });
  for (let i = 0; i < n; i++) {
    // box-shaped drone
    const drone = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.5, 3),
      mat.clone()
    );
    drone.castShadow = true;

    // random spin speed for each drone
    drone.userData.spinSpeed = THREE.MathUtils.randFloat(0.04, 0.08);

    const x = (i % 2 ? 60 : -60);
    const z = (i < 2 ? -80 : 80);
    drone.position.set(x, 15 + (i % 2) * 3, z);

    drones.push(drone);
    scene.add(drone);
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Cars on circular path
  if (carsMoving) {
    cars.forEach(car => {
      car.userData.angle += 0.005;
      const r = 80;
      car.position.set(
        Math.cos(car.userData.angle) * r,
        0.75,
        Math.sin(car.userData.angle) * r
      );
      car.rotation.y = -car.userData.angle + Math.PI / 2;
    });
  }

  // Drones rotating in place
  drones.forEach((d, i) => {
    const flag = i < 2 ? dronesRotating01 : dronesRotating23;
    if (flag) {
      d.rotation.y += d.userData.spinSpeed;
    }
  });

  controls.update();
  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKey(e) {
  const k = e.key.toLowerCase();
  if (k === 'c') carsMoving       = !carsMoving;
  if (k === 'd') dronesRotating01 = !dronesRotating01;
  if (k === 'f') dronesRotating23 = !dronesRotating23;
  if (k === '1') setSideView();
  if (k === '2') setTopView();
}

function setSideView() {
  camera.position.set(120, 40, 0);
  controls.target.set(0, 20, 0);
  controls.update();
}

function setTopView() {
  camera.position.set(0, 200, 0.1);
  camera.up.set(0, 0, -1);
  controls.target.set(0, 0, 0);
  controls.update();
}
