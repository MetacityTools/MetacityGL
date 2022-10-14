import * as THREE from 'three';
import { TileData } from '../../utils/types';
import { MeshUniformMaterial } from '../materials/meshUniformMaterial';
import { tileGeometry } from './geometry/tile';
import { BaseMeshModel } from './model';


export class TileModel extends BaseMeshModel {
    static readonly defaultMaterial = new MeshUniformMaterial();

    static create(data: TileData) {
        const tile = tileGeometry(data.center, data.width, data.height);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(tile.positions, 3));
        //geometry.setAttribute('dot', new THREE.BufferAttribute(tile.dots, 1));
        
        const mesh = new TileModel(geometry, this.defaultMaterial);
        mesh.matrixAutoUpdate = false;
        mesh.uniforms = {
            modelColor: data.color
        };
        return mesh;
    }

    toPickable(): void {
        this.visible = false;
    }

    lighten() {
        this.uniforms = {
            modelColor: this._uniforms.modelColor.map((c: number) => c * 1.5)
        };
    }


}
