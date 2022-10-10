import * as THREE from 'three';
import { MeshData } from '../../utils/types';
import { MeshMaterial } from '../materials/meshMaterial';
import { MeshPickMaterial } from '../materials/meshPickMaterial';
import { BaseMeshModel } from './model';


export class MeshModel extends BaseMeshModel {
    static readonly defaultMaterial = new MeshMaterial();
    static readonly pickableMaterial = new MeshPickMaterial(); 

    static create(data: MeshData) {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(data.normals, 3));
        
        if (data.ids)
            geometry.setAttribute('idcolor', new THREE.BufferAttribute(data.ids, 3));
        
        if (data.colors)
            geometry.setAttribute('color', new THREE.BufferAttribute(data.colors, 3));
        
        const mesh = new MeshModel(geometry, this.defaultMaterial);
        //just to test (mesh.material as THREE.ShaderMaterial).wireframe = true;
        return mesh;
    }

    toPickable(): void {
        this.material = MeshModel.pickableMaterial;
    }
}
