import * as THREE from "three";
import { LineData } from "../../utils/types";
import { GraphicsContext } from "../context";
import { DoubleLineMaterial } from "../materials/doubleLineMaterial";
import { DoubleLinePickMaterial } from "../materials/doubleLinePickMaterial";
import { halfsegment } from "./geometry/halfsegment";
import { BaseInstancedModel } from "./model";


const SEGMENT_INSTANCE = new Float32Array(halfsegment());

type uniforms = {
    thickness: number;
    space: number;
}


export class DoubleLineModel extends BaseInstancedModel {
    static readonly defaultMaterial = new DoubleLineMaterial();
    static readonly pickableMaterial = new DoubleLinePickMaterial();

    static create(data: LineData, uniforms: uniforms) {
        const geometry = new THREE.InstancedBufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(SEGMENT_INSTANCE, 3));
        geometry.setAttribute('lineStart', new THREE.InterleavedBufferAttribute(
            new THREE.InstancedInterleavedBuffer(data.positions, 6, 1), 3, 0));

        geometry.setAttribute('lineEnd', new THREE.InterleavedBufferAttribute(
            new THREE.InstancedInterleavedBuffer(data.positions, 6, 1), 3, 3));

        geometry.setAttribute('color', new THREE.InstancedBufferAttribute(data.colors, 3, true, 1));
        
        if (data.ids)
            geometry.setAttribute('idcolor', new THREE.InstancedBufferAttribute(data.ids, 3, true, 1));

        const mesh = new DoubleLineModel(geometry, this.defaultMaterial, 0);
        mesh.count = data.positions.length / 6;
        mesh.matrixAutoUpdate = false;
        mesh.frustumCulled = false; 
        mesh.userData.originalColor = data.colors;
        mesh.instanceMatrix = new THREE.InstancedBufferAttribute(new Float32Array(0), 0);
        mesh.uniforms = uniforms;
        return mesh;
    }

    setColors(colors: Float32Array) {
        this.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3, true, 1));
    }

    restoreColors() {
        this.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(this.userData.originalColor, 3, true, 1));
    }

    toPickable() {
        this.material = DoubleLineModel.pickableMaterial;
    }
}

