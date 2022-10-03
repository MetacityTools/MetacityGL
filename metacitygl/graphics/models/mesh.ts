import * as THREE from 'three';
import { MeshData } from '../../utils/types';
import { GraphicsContext } from '../context';
import { MeshMaterial } from '../materials/meshMaterial';
import { MeshPickMaterial } from '../materials/meshPickMaterial';

import { Model } from './model';


export class MeshModel extends THREE.Mesh implements Model {
    static readonly defaultMaterial = new MeshMaterial();
    static readonly pickableMaterial = new MeshPickMaterial(); 

    static create(data: MeshData, uniforms: {} = {}) {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(data.normals, 3));
        
        if (data.ids)
            geometry.setAttribute('idcolor', new THREE.BufferAttribute(data.ids, 3));
        
        if (data.colors)
            geometry.setAttribute('color', new THREE.BufferAttribute(data.colors, 3));
        
        const mesh = new MeshModel(geometry, this.defaultMaterial);
        mesh.matrixAutoUpdate = false;
        return mesh;
    }

    onAdd(context: GraphicsContext) {
        //pass
    }

    toPickable(): void {
        this.material = MeshModel.pickableMaterial;
    }

    set grayscale(value: number) {
        (this.material as THREE.ShaderMaterial).uniforms.grayscale.value = value;
        (this.material as THREE.ShaderMaterial).uniformsNeedUpdate = true;
    }
}
