import * as THREE from "three";

export class Board {
    constructor(tileSize, tileAmount) {
        this.tileSize = tileSize;
        this.tileAmount = tileAmount;
        this.materiales = [
            new THREE.MeshBasicMaterial({
                color: 0x2e3336,
            }),
            new THREE.MeshBasicMaterial({
                color: 0x3f4549,
            })
        ];
        this.tiles = new THREE.Object3D();
        const boardPosition = - this.tileSize*this.tileAmount / 2 + (this.tileSize / 2)
        this.tiles.position.setZ(boardPosition)
        this.tiles.position.setX(boardPosition)
        this.generateTiles()
    }

    generateTiles() {
        for (let z = 0; z < this.tileAmount; z++) {
            for (let x = 0; x < this.tileAmount; x++) {
                const tile = new THREE.Mesh(
                    new THREE.PlaneGeometry(this.tileSize, this.tileSize),
                    this.materiales[(x + z) % 2]
                );
                tile.position.z = z * this.tileSize;
                tile.position.x = x * this.tileSize;
                tile.rotation.x = Math.PI * 1.5
                this.tiles.add(tile);
            }
        }
    }
}
