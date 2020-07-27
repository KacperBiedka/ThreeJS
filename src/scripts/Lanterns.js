import * as THREE from "three/build/three.module";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  2000
);
camera.position.z = 20;
camera.lookAt(scene.position);

var directionalLight = new THREE.DirectionalLight(0xffeedd);
directionalLight.position.set(0, 0, 1).normalize();
scene.add(directionalLight);

// model
var mesh = null;

var mtlLoader = new MTLLoader();
mtlLoader.load(require("../assets/lamp/lamp.mtl"), function (materials) {
  materials.preload();

  var objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load(require("../assets/lamp/lamp.obj"), function (object) {
    mesh = object;
    object.position.y = -2;
    scene.add(mesh);
  });
});

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xe2fab5);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener("change", () => {
  if (scene.children[1]) {
    console.log(scene.children[1].children[2]);
    const sideWalls = scene.children[1].children[2];
    sideWalls.visible = false;
    scene.children[1].children[3].material.forEach((material, index) => {
      console.info(index);
      material.color.setHex(0xff0000);
    });
    const lightBulb = scene.children[1].children[1];
    scene.children[1].children[0].material.color.setHex(0xff0000);
    lightBulb.material.color.setHex(0xfffff0);
  }
}); // use if there is no animation loop
controls.minDistance = 2;
controls.maxDistance = 10;
controls.target.set(0, 0, -0.2);
controls.update();

animate();

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
