import { BaseGroupModel } from "./model";
import * as THREE from "three";
import { InstancedPointData } from "../../utils/types";
import { PointModel } from "./points";
import { InstancedMeshModel } from "./meshInstanced";
import { GraphicsContext } from "../context";

type uniforms = {
    size?: number,
    modelColor?: [number, number, number],
    swapDistance?: number,
}



export class PointsInstancedModel extends BaseGroupModel {
    static create(data: InstancedPointData, uniforms: uniforms) : THREE.Object3D {
        const points = PointModel.create(data, uniforms);
        const mesh = InstancedMeshModel.create(data, uniforms);
        const group = new PointsInstancedModel();
        group.add(points);
        group.add(mesh);
        const swp = uniforms.swapDistance || 1000;
        group.userData.swapDistance = swp * swp;
        group.userData.centroid = new THREE.Vector3(...data.centroid);

        return group;
    }

    onAdd(context: GraphicsContext): void {
        context.onNavChange = (_, position: THREE.Vector3) => {
            const distSqr = position.distanceToSquared(this.userData.centroid);
            if (distSqr < this.userData.swapDistance) {
                this.children[0].visible = false;
                this.children[1].visible = true;
            } else {
                this.children[0].visible = true;
                this.children[1].visible = false;
            }
        }
    }
}