
import { LineModel } from "./line";
import * as THREE from "three";
import { Model } from "./model";
import { GraphicsContext } from "../context";
import { gridXY } from "./geometry/grid";
import { colorHex } from "../../utils/utils/color";
import { GridData } from "../../utils/types";
import { MeshUniformMaterial } from "../materials/meshUniformMaterial";


export class GridModel extends THREE.Mesh implements Model{
    static create(data: GridData, uniforms: { thickness: number }) {
        const buffer = gridXY(data.from, data.to, data.z, data.major, data.divideMajor, uniforms.thickness);
        const color = colorHex(data.color);
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(buffer, 3));
        //TODO add color
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

    onAdd(context: GraphicsContext) {
        //pass
    }

}