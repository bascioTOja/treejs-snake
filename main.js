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

camera.position.set(1, 13, 21);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement);

const light = new THREE.HemisphereLight(0xffffff, 0x4444);
scene.add(light);
scene.background = new THREE.Color(0x614f4b);

const board = new Board();
scene.add(board.tiles);
camera.lookAt(new THREE.Vector3(Board.tileAmount*Board.tileSize/2, 0, Board.tileAmount*Board.tileSize/2));

let food = new Food(new Vector(0, 0));
board.tiles.add(food.mesh)

let snake = getNewSnake();
board.tiles.add(snake.segments)

window.addEventListener('resize', (e) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function placeRandomFood() {
    const freeSpots = {};
    for (let x = 0; x < Board.tileAmount; x += 1) {
        for (let y = 0; y < Board.tileAmount; y += 1) {
            freeSpots[`${x},${y}`] = {x, y};
        }
    }

    snake.body.forEach(segment => {
        delete freeSpots[`${segment.position.x},${segment.position.y}`];
    });

    const freeSpotsList = Object.values(freeSpots);
    if (freeSpotsList.length) {
        const freeSpot = freeSpotsList[Math.floor(Math.random() * freeSpotsList.length)];
        food.dispose();
        food = new Food(new Vector(freeSpot.x, freeSpot.y));
        board.tiles.add(food.mesh)
    }
}

function getNewSnake() {
    return new Snake(3, new Vector(Math.round(Board.tileAmount * 0.25), Math.round(Board.tileAmount / 2)), directionMap.right);
}

function restartGame() {
    snake.dispose()
    snake = getNewSnake()
    board.tiles.add(snake.segments)

    placeRandomFood()
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

    if (snake.checkSelfCollision() || snake.checkWallCollision(Board.tileAmount, Board.tileAmount)) {
        restartGame()
    }

    if (snake.checkFoodCollision(food)) {
        snake.grow()
        placeRandomFood()
    }
}

function render () {
    const delta = clock.getDelta();
    update(delta);
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

function init() {
    placeRandomFood()
    document.addEventListener('keydown', handleKeyDown);
    render();
}

init();
