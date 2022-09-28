import { GridData } from "../types";
import { LineModel } from "./line";
import * as THREE from "three";
import { Model } from "./model";
import { GraphicsContext } from "../context";
import { gridXY } from "./geometry/grid";
import { colorHex } from "../utils/color";


export class GridModel extends THREE.Group implements Model{
    static create(data: GridData, uniforms: {}) {
        const geometry = gridXY(data.from, data.to, data.z, data.major, data.divideMajor);
        const color = colorHex(data.color);
        const majorColors = new Float32Array(geometry.majors.length);
        const minorColors = new Float32Array(geometry.minors.length);
        for(let i = 0; i < majorColors.length; i += 3) {
            majorColors[i] = color[0];
            majorColors[i + 1] = color[1];
            majorColors[i + 2] = color[2];
        }
        for(let i = 0; i < minorColors.length; i += 3) {
            minorColors[i] = color[0] * 0.9;
            minorColors[i + 1] = color[1] * 0.9;
            minorColors[i + 2] = color[2] * 0.9;
        }

        const major = LineModel.create({
            positions: geometry.majors,
            colors: majorColors
        }, {
            thickness: 5
        });

        const minor = LineModel.create({
            positions: geometry.minors,
            colors: minorColors
        }, {
            thickness: 1
        });

        const group = new GridModel();
        group.add(major);
        group.add(minor);
        return group;
    }

    toPickable(): void {
        this.visible = false;
    }

    onAdd(context: GraphicsContext) {
        //pass
    }

}