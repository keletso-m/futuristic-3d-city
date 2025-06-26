// Import Three.js and OrbitControls as modules from the CDN
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// Your Three.js code follows here...


// rest of your code...


// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(30, 20, 30);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2;

// Ground plane
const groundGeo = new THREE.PlaneGeometry(200, 200);
const groundMat = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Generate skyscrapers
const buildingGeo = new THREE.BoxGeometry(2, 1, 2);
const buildingMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc });

for (let i = 0; i < 12; i++) {
    const height = Math.random() * 15 + 5;
    const building = new THREE.Mesh(buildingGeo.clone(), buildingMat.clone());
    building.scale.y = height;
    building.position.set(
        (Math.random() - 0.5) * 100,
        height / 2,
        (Math.random() - 0.5) * 100
    );
    building.material.color.setHex(Math.random() * 0xffffff);
    scene.add(building);
}

// Cars placeholders
const carGeo = new THREE.BoxGeometry(1, 0.5, 2);
const carMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
let cars = [];

for (let i = 0; i < 4; i++) {
    const car = new THREE.Mesh(carGeo, carMat.clone());
    car.position.set(i * 3 - 6, 5, 0);
    scene.add(car);
    cars.push(car);
}

// Drones placeholders
const droneGeo = new THREE.SphereGeometry(0.5, 16, 16);
const droneMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let drones = [];

for (let i = 0; i < 4; i++) {
    const drone = new THREE.Mesh(droneGeo, droneMat.clone());
    drone.position.set(i * 4 - 8, 8, -5);
    scene.add(drone);
    drones.push(drone);
}

let carsMoving = true;
let dronesRotating = true;

document.addEventListener('keydown', (event) => {
    if (event.key === 'c') carsMoving = !carsMoving;
    if (event.key === 'd') dronesRotating = !dronesRotating;
});

function animate() {
    requestAnimationFrame(animate);

    if (carsMoving) {
        cars.forEach((car, i) => {
            car.position.x += 0.05;
            if (car.position.x > 20) car.position.x = -20;
        });
    }

    if (dronesRotating) {
        drones.forEach((drone) => {
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
