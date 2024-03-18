import * as THREE from "three";

export class Food {
    static material = new THREE.MeshBasicMaterial({color: 0xab4343});

    constructor(position) {
        this.position = position;
        this.mesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), Food.material);
        this.mesh.position.setX(this.position.x);
        this.mesh.position.setY(0.25);
        this.mesh.position.setZ(this.position.y);
    }

    dispose() {
        this.mesh.removeFromParent()
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }
}
