import { TreeData } from "../../utils/types";
import { BaseInstancedModel } from "./model";
import * as THREE from "three";
import { unitCube } from "./geometry/cube";
import { TreeMaterial } from "../materials/treeMaterial";


export class TreeModel extends BaseInstancedModel {
    static readonly defaultMaterial = new TreeMaterial();

    static create(data: TreeData) {
        const cube = unitCube();
        const geometry = new THREE.InstancedBufferGeometry();

        geometry.setAttribute('position', new THREE.BufferAttribute(cube.positions, 3));
        geometry.setAttribute('dot', new THREE.BufferAttribute(cube.dots, 1));
        
        const buffer = new THREE.InstancedInterleavedBuffer(data.array, 9, 1);
        geometry.setAttribute('center', new THREE.InterleavedBufferAttribute(buffer, 3, 0));
        geometry.setAttribute('dimensions', new THREE.InterleavedBufferAttribute(buffer, 3, 3));
        geometry.setAttribute('color', new THREE.InterleavedBufferAttribute(buffer, 3, 6));

        const count = data.array.length / 9;
        const mesh = new TreeModel(geometry, this.defaultMaterial, 0);
        mesh.count = count;
        mesh.frustumCulled = false;
        mesh.matrixAutoUpdate = false;
        mesh.instanceMatrix = new THREE.InstancedBufferAttribute(new Float32Array(0), 0);
        return mesh;
    }

    updateBuffer(data: TreeData) {
        const buffer = new THREE.InstancedInterleavedBuffer(data.array, 9, 1);
        this.geometry.setAttribute('center', new THREE.InterleavedBufferAttribute(buffer, 3, 0));
        this.geometry.setAttribute('dimensions', new THREE.InterleavedBufferAttribute(buffer, 3, 3));
        this.geometry.setAttribute('color', new THREE.InterleavedBufferAttribute(buffer, 3, 6));
        this.count = data.array.length / 9;
        this.geometry.attributes.center.needsUpdate = true;
        this.geometry.attributes.dimensions.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
    }

    toPickable(): void {
        this.visible = false;
    }
}