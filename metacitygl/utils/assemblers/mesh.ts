import { computeBBox } from "../utils/bbox";
import { colorHexToArr } from "../utils/color";
import { computeNormals } from "../utils/normals";



export class MeshAssembler {
    positions: number[] = [];
    colors: number[] = [];
    ids: number[] = [];
    metadata: {[id: number]: any} = {};

    static readonly type = "mesh";  

    constructor(private id = 1) {

    }

    addMesh(vertices: Float32Array|number[], rgb: number[], metadata: any) {
        for(let i = 0; i < vertices.length; i++)
            this.positions.push(vertices[i]);
            
        const vertexCount = vertices.length / 3;
        const idcolor = colorHexToArr(this.id);
        for (let i = 0; i < vertexCount; i++) {
            this.colors.push(rgb[0], rgb[1], rgb[2]);
            this.ids.push(idcolor[0], idcolor[1], idcolor[2]);
        }

        metadata["bbox"] = computeBBox(vertices);
        metadata["height"] = metadata["bbox"][1][2] - metadata["bbox"][0][2];
        this.metadata[this.id] = metadata;
        this.id++;
    }

    pickTransferables(buffers: any) {
        if (buffers === undefined)
            return [];
        return [buffers.positions.buffer, buffers.normals.buffer, buffers.colors.buffer, buffers.ids.buffer];
    }

    get idCounter() {
        return this.id;
    }

    toBuffers() {
        if (this.positions.length === 0)
            return undefined;
            
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