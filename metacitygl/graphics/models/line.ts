import * as THREE from "three";
import { LineData } from "../../utils/types";
import { GraphicsContext } from "../context";
import { LineMaterial } from "../materials/lineMaterial";
import { LinePickMaterial } from "../materials/linePickMaterial";
import { segment } from "./geometry/segment";
import { Model } from "./model";


const SEGMENT_INSTANCE = new Float32Array(segment());

type uniforms = {
    thickness: number;
}


export class LineModel extends THREE.InstancedMesh implements Model {

    static readonly defaultMaterial = new LineMaterial();
    static readonly pickableMaterial = new LinePickMaterial();

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

        const mesh = new LineModel(geometry, this.defaultMaterial, 0);
        mesh.count = data.positions.length / 6;
        mesh.matrixAutoUpdate = false;
        mesh.frustumCulled = false; 
        mesh.instanceMatrix = new THREE.InstancedBufferAttribute(new Float32Array(0), 0);

        mesh.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
            (material as THREE.ShaderMaterial).uniforms.thickness.value = uniforms.thickness ?? 10;
            (material as THREE.ShaderMaterial).uniformsNeedUpdate = true;
        }
        return mesh;
    }

    onAdd(context: GraphicsContext) {
        //pass
    }

    toPickable() {
        this.material = LineModel.pickableMaterial;
    }

    set grayscale(value: number) {
        (this.material as THREE.ShaderMaterial).uniforms.grayscale.value = value;
        (this.material as THREE.ShaderMaterial).uniformsNeedUpdate = true;
    }
}
