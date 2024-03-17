import './style.css';
import * as THREE from 'three';

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {Board} from "./src/board.js";


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    40, // fov
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1,
    1000
);

camera.position.set(-3, 7, 12);
// const camera = new THREE.OrthographicCamera(
//     900, 900, 300, -300,
//     0.1,
//     1000
// );
// camera.zoom = 52
// camera.position.set(1.168099968899527, 4.557983352866799, 7.5889685839309475);
// camera.rotation.set(-0.72732, -0.665367, -0.5024688434);
// camera.quaternion.set(-0.24976524, -0.379218798, -0.10708363716, 0.8845018493073)
// camera.up.y = 1
// scene.add(camera);

// const camera = new THREE.OrthographicCamera(
//     window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2,
//     0.1,
//     1000
// );


scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement);

const light = new THREE.HemisphereLight(0xffffff, 0x4444)
scene.add(light)

const board = new Board(1, 10)
scene.add(board.tiles)

window.addEventListener("resize", (e) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function render () {

    renderer.render( scene, camera );

    requestAnimationFrame(render);
}

render();
