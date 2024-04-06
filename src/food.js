import * as THREE from "three";
import {Board} from "./board.js";

export class Food {
    static material = new THREE.MeshBasicMaterial({color: 0xab4343});

    constructor(position) {
        const foodSize = Board.tileSize * 0.5;
        this.position = position;
        this.mesh = new THREE.Mesh(new THREE.BoxGeometry(foodSize, foodSize, foodSize), Food.material);
        this.mesh.position.setX(this.position.x * Board.tileSize);
        this.mesh.position.setY(foodSize * 0.5);
        this.mesh.position.setZ(this.position.y * Board.tileSize);
    }

    dispose() {
        this.mesh.removeFromParent()
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }
}
