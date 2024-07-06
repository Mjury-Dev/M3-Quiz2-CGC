import * as THREE from './three.module.js';
import { FontLoader } from "./FontLoader.js";
import { TextGeometry } from "./TextGeometry.js";

let nameMesh = new THREE.Mesh();
let name = "Mike"; 

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let stars, starGeo;

lighting();
particles();
myname();


function particles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("assets/images/star.png");
  let starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
  
  setInterval(changeColor, 3000);
}

function changeColor() {
  let randomColor = Math.random() * 0xffffff;
  stars.material.color.setHex(randomColor);
}

function animateParticles() {
    starGeo.verticesNeedUpdate = true;
    stars.position.z -= 1;

    if(stars.position.z < -300) {
      stars.position.z = 100;
    }
  }

function myname() {
  const texture = new THREE.TextureLoader().load('./assets/textures/tiles.png')
  const loader = new FontLoader();

  loader.load('assets/font/CaliforniaPersonalUse_Regular.json', function (font) {
      const textGeometry = new TextGeometry(name, {
          font: font,
          size: 6,
          height: 2,
      });
      textGeometry.center();
      const textMaterial = new THREE.MeshPhongMaterial({ map: texture });
      nameMesh = new THREE.Mesh(textGeometry, textMaterial);
      scene.add(nameMesh);
  });
  camera.position.z = 25;
}

function animateName() {
  nameMesh.rotation.x += 0.01;
  nameMesh.rotation.y += 0.01;
  nameMesh.rotation.z += 0.01;
}

function lighting() {
  const light = new THREE.HemisphereLight(0xffffff, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

function animate() {
  animateParticles();
  animateName();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();