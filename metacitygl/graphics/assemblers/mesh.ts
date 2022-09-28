import { vec3 } from "../types";
import { computeBBox } from "../utils/bbox";
import { colorHex } from "../utils/color";
import { computeNormals } from "../utils/normals";



export class MeshAssembler {
    positions: number[] = [];
    colors: number[] = [];
    ids: number[] = [];
    metadata: {[id: number]: any} = {};

    static readonly type = "mesh";  

    constructor(private id = 1) {}

    addMesh(vertices: number[], rgb: number[], metadata: any) {
        this.positions.push(...vertices);
        const vertexCount = vertices.length / 3;
        const idcolor = colorHex(this.id);
        for (let i = 0; i < vertexCount; i++) {
            this.colors.push(rgb[0], rgb[1], rgb[2]);
            this.ids.push(idcolor[0], idcolor[1], idcolor[2]);
        }
        metadata["bbox"] = computeBBox(vertices);
        this.metadata[this.id] = metadata;
        this.id++;
    }

    toBuffers() {
        return {
            positions: new Float32Array(this.positions),
            normals: computeNormals(this.positions),
            colors: new Float32Array(this.colors),
            ids: new Float32Array(this.ids),
            metadata: this.metadata,
            type: MeshAssembler.type
        };
    }

}