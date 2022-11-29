import { InstancedMeshData } from "../../utils/types";
import { InstancedMeshMaterial } from "../materials/instancedMeshMaterial";
import { BaseInstancedModel } from "./model";
import * as THREE from "three";


type uniforms = {
    size?: number,
    modelColor?: [number, number, number],
}


export class InstancedMeshModel extends BaseInstancedModel {
    static readonly defaultMaterial = new InstancedMeshMaterial();

    static create(data: InstancedMeshData, uniforms: uniforms) {
        const geometry = new THREE.InstancedBufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(data.instancePositions, 3));
        geometry.setAttribute('dot', new THREE.BufferAttribute(data.instanceDots, 1));
        geometry.setAttribute('instanceShift', 
            new THREE.InstancedBufferAttribute(data.positions, 3, false, 1));

        const count = data.positions.length / 3;
        const mesh = new InstancedMeshModel(geometry, this.defaultMaterial, 0);
        mesh.count = count;
        mesh.frustumCulled = false;
        mesh.matrixAutoUpdate = false;
        mesh.instanceMatrix = new THREE.InstancedBufferAttribute(new Float32Array(0), 0);
        mesh.uniforms = uniforms;
        return mesh;
    }

    toPickable(): void {
        this.visible = false;
    }
}