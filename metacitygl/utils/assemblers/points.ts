import { computeBBox } from "../utils/bbox";
import { colorHexToArr } from "../utils/color";


export class PointsAssembler {
    positions: number[] = [];
    ids: number[] = [];
    metadata: {[id: number]: any} = {};

    static readonly type = "points";

    constructor(private id = 1) {}

    addPoints(vertices: Float32Array|number[], metadata: any) {
        for(let i = 0; i < vertices.length; i++)
            this.positions.push(vertices[i]);

        const vertexCount = vertices.length / 3;
        const idcolor = colorHexToArr(this.id);
        for (let i = 0; i < vertexCount; i++) {
            this.ids.push(idcolor[0], idcolor[1], idcolor[2]);
        }

        metadata["bbox"] = computeBBox(vertices);
        metadata["height"] = metadata["bbox"][1][2] - metadata["bbox"][0][2];
        this.metadata[this.id] = metadata;   
    }

    pickTransferables(buffers: any) {
        return [buffers.positions.buffer, buffers.ids.buffer];
    }

    toBuffers() {
        return {
            positions: new Float32Array(this.positions),
            ids: new Float32Array(this.ids),
            metadata: this.metadata,
            type: PointsAssembler.type
        };
    }
}