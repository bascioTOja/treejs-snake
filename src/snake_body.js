import {Board} from "./board";
import * as THREE from "three";

export class SnakeBody {
    static headMaterial = new THREE.MeshBasicMaterial({color: 0xc48d4d});
    static bodyMaterial = new THREE.MeshBasicMaterial({color: 0x85c44d});

    constructor(position, is_head = true) {
        this.is_head = is_head;
        this.position = position;
        this.mesh = new THREE.Mesh(new THREE.BoxGeometry(Board.tileSize, Board.tileSize, Board.tileSize), this.is_head ? SnakeBody.headMaterial : SnakeBody.bodyMaterial);
        this.mesh.position.set(this.position.x * Board.tileSize, 0.4, this.position.y * Board.tileSize);
    }

    changeToBody() {
        this.is_head = false;
        this.mesh.material = SnakeBody.bodyMaterial;
    }

    dispose() {
        this.mesh.geometry.dispose();
        this.mesh.removeFromParent()
    }
}
