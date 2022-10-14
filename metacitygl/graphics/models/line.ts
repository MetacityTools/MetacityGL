import * as THREE from "three";
import { LineData } from "../../utils/types";
import { GraphicsContext } from "../context";
import { LineMaterial } from "../materials/lineMaterial";
import { LinePickMaterial } from "../materials/linePickMaterial";
import { segment } from "./geometry/segment";
import { BaseInstancedModel } from "./model";


const SEGMENT_INSTANCE = new Float32Array(segment());

type uniforms = {
    thickness: number;
}

export class LineModel extends BaseInstancedModel {

    static readonly defaultMaterial = new LineMaterial();
    static readonly pickableMaterial = new LinePickMaterial();

    static create(data: LineData, uniforms: uniforms) {
        const geometry = new THREE.InstancedBufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(SEGMENT_INSTANCE, 3));
        const buffer = new THREE.InstancedInterleavedBuffer(data.positions, 6, 1);
        geometry.setAttribute('lineStart', new THREE.InterleavedBufferAttribute(buffer, 3, 0));

        geometry.setAttribute('lineEnd', new THREE.InterleavedBufferAttribute(buffer, 3, 3));

        geometry.setAttribute('color', new THREE.InstancedBufferAttribute(data.colors, 3, true, 1));
        
        if (data.ids)
            geometry.setAttribute('idcolor', new THREE.InstancedBufferAttribute(data.ids, 3, true, 1));

        const mesh = new LineModel(geometry, this.defaultMaterial, 0);
        mesh.count = data.positions.length / 6;
        mesh.matrixAutoUpdate = false;
        mesh.frustumCulled = false; 
        mesh.instanceMatrix = new THREE.InstancedBufferAttribute(new Float32Array(0), 0);
        mesh.uniforms = uniforms;
        return mesh;
    }

    toPickable() {
        this.material = LineModel.pickableMaterial;
    }
}

