import { vec3 } from "../types";
import { colorHexToArr } from "../utils/color";


//can be used to construst both lines and double-lines
export class LineAssembler {
    positions: number[] = [];
    colors: number[] = [];
    ids: number[] = [];
    metadata: {[id: number]: any} = {};

    static readonly type = "line";  

    constructor(private id = 1) {}

    addEdge(from: vec3, to: vec3, rgb: number[], metadata: any) {
        this.positions.push(from.x, from.y, from.z, to.x, to.y, to.z);
        this.colors.push(rgb[0], rgb[1], rgb[2]);
        const idcolor = colorHexToArr(this.id);
        this.ids.push(idcolor[0], idcolor[1], idcolor[2]);
        this.metadata[this.id] = metadata;
        this.id++;
    }

    pickTransferables(buffers: any) {
        if (buffers === undefined)
            return [];

        return [buffers.positions.buffer, buffers.colors.buffer, buffers.ids.buffer];
    }

    toBuffers() {
        if (this.positions.length === 0)
            return undefined;
            
        return {
            positions: new Float32Array(this.positions),
            colors: new Uint8Array(this.colors),
            ids: new Uint8Array(this.ids),
            metadata: this.metadata,
            type: LineAssembler.type
        };
    }
}