import './style.css';
import * as THREE from 'three';

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {Board} from "./src/board.js";
import {Vector} from "./src/vector.js";
import {Food} from "./src/food.js";
import {directionMap} from "./src/directions_map.js";
import {Snake} from "./src/snake.js";


const speed = 0.125
let move_timer = speed;

const scene = new THREE.Scene();
let clock = new THREE.Clock();
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

const light = new THREE.HemisphereLight(0xffffff, 0x4444);
scene.add(light);
scene.background = new THREE.Color(0x614f4b);

const board = new Board();
scene.add(board.tiles);

let food = new Food(new Vector(0, 0));
board.tiles.add(food.mesh)

const snake = new Snake(3, new Vector(5, 5), directionMap.right);
board.tiles.add(snake.segments)

window.addEventListener('resize', (e) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function placeRandomFood() {
    const freeSpots = {};
    for (let x = 0; x < Board.tileAmount; x += Board.tileSize) {
        for (let y = 0; y < Board.tileAmount; y += Board.tileSize) {
            freeSpots[`${x},${y}`] = {x, y};
        }
    }
    //
    // snake.body.forEach(segment => {
    //     delete freeSpots[`${segment.position.x},${segment.position.y}`];
    // });
    //
    const freeSpotsList = Object.values(freeSpots);
    if (freeSpotsList.length) {
        const freeSpot = freeSpotsList[Math.floor(Math.random() * freeSpotsList.length)];
        food.dispose();
        food = new Food(new Vector(freeSpot.x, freeSpot.y));
        board.tiles.add(food.mesh)
    }
}

function handleKeyDown(event) {
    switch (event.keyCode) {
        case 37: // ←
        case 65: // a
            snake.appendMove(directionMap.left);
            break;
        case 38: // ↑
        case 87: // w
            snake.appendMove(directionMap.up);
            break;
        case 39: // →
        case 68: // d
            snake.appendMove(directionMap.right);
            break;
        case 40: // ↓
        case 83: // s
            snake.appendMove(directionMap.down);
            break;
    }
}

function update(dt) {
    if (move_timer > 0) {
        move_timer -= dt
        return

    }
    move_timer = speed

    snake.move()
}

function render () {
    const delta = clock.getDelta();
    update(delta);
    renderer.render( scene, camera );

    requestAnimationFrame(render);
}

function init() {
    placeRandomFood()
    document.addEventListener('keydown', handleKeyDown);
    render();
}

init();
