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
                    startPosition.x - i,
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
        return this.body.slice(1).some(segment => segment.position.x === this.head.position.x && segment.position.y === this.head.position.y);
    }

    checkWallCollision(width, height) {
        return this.head.position.x > (width - 1) || this.head.position.x < 0 || this.head.position.y > (height - 1) || this.head.position.y < 0;
    }

    checkFoodCollision(food) {
        return food.position.x === this.head.position.x && food.position.y === this.head.position.y;
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
        const newHead = new SnakeBody(new Vector(this.head.position.x + this.direction.x, this.head.position.y + this.direction.y));
        const parentMesh = this.head.mesh.parent;
        parentMesh.add(newHead.mesh)
        this.appendHead(newHead);
        this.removeLastBody();
    }

    grow(amount = 1) {
        let lastBody = this.body[this.body.length - 1];
        for (let i = 0; i < amount; i++) {
            this.addNewBodyPart(new Vector(lastBody.position.x, lastBody.position.z))
        }
    }

    removeLastBody() {
        let lastSegment = this.body.pop();
        lastSegment.dispose();
    }

    addNewBodyPart(position) {
        let newSegment = new SnakeBody(new Vector(position.x, position.y), false)
        this.body.push(newSegment)
        this.segments.add(newSegment.mesh)
    }

    dispose() {
        for (let segment of this.body) {
            segment.dispose()
        }
        this.segments.removeFromParent()
    }
}
