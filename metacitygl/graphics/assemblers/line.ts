import { vec3 } from "../types";
import { colorHex } from "../utils/color";


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
        const idcolor = colorHex(this.id);
        this.ids.push(idcolor[0], idcolor[1], idcolor[2]);

        metadata["bbox"] = [
            [ Math.min(from.x, to.x), Math.min(from.y, to.y), Math.min(from.z, to.z) ],
            [ Math.max(from.x, to.x), Math.max(from.y, to.y), Math.max(from.z, to.z) ]
        ];

        this.metadata[this.id] = metadata;
        this.id++;
    }

    toBuffers() {
        return {
            positions: new Float32Array(this.positions),
            colors: new Float32Array(this.colors),
            ids: new Float32Array(this.ids),
            metadata: this.metadata,
            type: LineAssembler.type
        };
    }
}