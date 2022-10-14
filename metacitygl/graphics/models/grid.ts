import * as THREE from "three";
import { BaseMeshModel } from "./model";
import { gridXY } from "./geometry/grid";
import { colorHexToArr } from "../../utils/utils/color";
import { GridData } from "../../utils/types";
import { MeshUniformMaterial } from "../materials/meshUniformMaterial";

type uniforms =  { thickness: number };

export class GridModel extends BaseMeshModel {
    static create(data: GridData, uniforms: uniforms) {
        const buffer = gridXY(data.from, data.to, data.z, data.major, data.divideMajor, uniforms.thickness);
        const color = colorHexToArr(data.color);
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(buffer, 3));
        const material = new MeshUniformMaterial();
        material.uniforms.modelColor.value = color;
        material.uniformsNeedUpdate = true;

        const mesh = new GridModel(geometry, material);
        mesh.matrixAutoUpdate = false;

        return mesh;
    }

    toPickable(): void {
        this.visible = false;
    }
}
