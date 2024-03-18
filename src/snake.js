import {Board} from "./board";
import {SnakeBody} from "./snake_body.js";
import {Vector} from "./vector";
import * as THREE from "three";

export class Snake {
    constructor(length, startPosition, startDirection) {
        this.direction = startDirection;
        this.moves = [];
        this.segments = new THREE.Object3D();
        this.body = Array.from({length}, (_, i) => (
            new SnakeBody(
                new Vector(
                    startPosition.x - i * Board.tileSize,
                    startPosition.y
                ),
                i === 0
            )
        ));
        for (let segment of this.body) {
            this.segments.add(segment.mesh);
        }
        this.head = this.getNewHead();
    }

    checkSelfCollision() {
        return this.body.slice(1).some(segment => segment.mesh.position.x === this.head.position.x && segment.mesh.position.z === this.head.mesh.position.z);
    }

    checkWallCollision(width, height) {
        return this.head.mesh.position.x > (width - Board.tileSize) || this.head.mesh.position.x < 0 || this.head.mesh.position.z > (height - Board.tileSize) || this.head.mesh.position.z < 0;
    }

    checkFoodCollision(food) {
        return food.mesh.position.x === this.head.mesh.position.x && food.mesh.position.z === this.head.mesh.position.z;
    }

    appendMove(newDirection) {
        const lastMove = this.moves.length ? this.moves[this.moves.length - 1] : this.direction;
        if ((lastMove.x === 0 && newDirection.x === 0) || (lastMove.y === 0 && newDirection.y === 0)) {
            return;
        }
        this.moves.push(new Vector(newDirection.x, newDirection.y));
    }

    updateDirection() {
        if (this.moves.length > 0) {
            this.direction = this.moves.shift();
        }
    }

    appendHead(newHead) {
        this.head.changeToBody();
        this.body.unshift(newHead);
        this.updateHead();
    }


    getNewHead(){
        return this.body[0];
    }

    updateHead(){
        this.head = this.getNewHead();
    }

    move() {
        this.updateDirection();
        const newHead = new SnakeBody(new Vector(this.head.mesh.position.x + this.direction.x, this.head.mesh.position.z + this.direction.y));
        this.appendHead(newHead);
        this.removeLastBody();
    }

    grow(amount = 1) {
        let lastBody = this.body[this.body.length - 1];
        for (let i = 0; i < amount; i++) {
            this.body.push(new SnakeBody(new Vector(lastBody.mesh.position.x, lastBody.mesh.position.z), false));
        }
    }

    removeLastBody() {
        let lastSegment = this.body.pop();
        lastSegment.dispose();
    }
}
