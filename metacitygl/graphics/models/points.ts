import { BaseInstancedModel } from "./model";
import * as THREE from "three";
import { PointsMaterial } from "../materials/pointsMaterial";
import { PointData } from "../../utils/types";
import { unitQuad } from "./geometry/quad";


type uniforms = {
    size?: number,
    modelColor?: [number, number, number]
}

const QUAD_INSTANCE = unitQuad();

export class PointModel extends BaseInstancedModel {
    static readonly defaultMaterial = new PointsMaterial();

    static create(data: PointData, uniforms: uniforms) {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(QUAD_INSTANCE, 3));
        geometry.setAttribute('instanceShift', new THREE.InstancedBufferAttribute(data.positions, 3, false, 1));
        
        const count = data.positions.length / 3;
        const points = new PointModel(geometry, this.defaultMaterial, 0);
        points.count = count;
        points.frustumCulled = false;
        points.matrixAutoUpdate = false;
        points.instanceMatrix = new THREE.InstancedBufferAttribute(new Float32Array(0), 0);
        points.uniforms = uniforms;
        return points;
    }

    toPickable(): void {
        this.visible = false;
    }
}


