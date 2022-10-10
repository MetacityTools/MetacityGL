import { BasePointModel } from "./model";
import * as THREE from "three";
import { PointsMaterial } from "../materials/pointsMaterial";
import { PointData } from "../../utils/types";


export class PointModel extends BasePointModel {
    static readonly defaultMaterial = new PointsMaterial();

    static create(data: PointData, uniforms: { size?: number } = {}) {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
        const points = new PointModel(geometry, this.defaultMaterial);
        points.matrixAutoUpdate = false;
        return points;
    }

    toPickable(): void {
        this.visible = false;
    }
}


