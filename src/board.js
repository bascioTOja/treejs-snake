import * as THREE from "three";

export class Board {
    static tileSize = 1;
    static tileAmount = 10;

    constructor() {
        this.materiales = [
            new THREE.MeshBasicMaterial({
                color: 0x2e3336,
            }),
            new THREE.MeshBasicMaterial({
                color: 0x3f4549,
            })
        ];
        this.tiles = new THREE.Object3D();
        const boardPosition = - Board.tileSize*Board.tileAmount / 2 + (Board.tileSize / 2)
        this.tiles.position.setZ(boardPosition)
        this.tiles.position.setX(boardPosition)
        this.generateTiles()
    }

    generateTiles() {
        for (let z = 0; z < Board.tileAmount; z++) {
            for (let x = 0; x < Board.tileAmount; x++) {
                const tile = new THREE.Mesh(
                    new THREE.PlaneGeometry(Board.tileSize, Board.tileSize),
                    this.materiales[(x + z) % 2]
                );
                tile.position.z = z * Board.tileSize;
                tile.position.x = x * Board.tileSize;
                tile.rotation.x = Math.PI * 1.5
                this.tiles.add(tile);
            }
        }
    }
}
