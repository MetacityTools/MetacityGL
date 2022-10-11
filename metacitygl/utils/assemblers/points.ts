import { computeBBox } from "../utils/bbox";
import { colorHexToArr } from "../utils/color";


export class PointsAssembler {
    positions: number[] = [];
    ids: number[] = [];
    metadata: {[id: number]: any} = {};
    private centroidAcc = [0, 0, 0];

    static readonly type = "points";

    constructor(private id = 1) {}

    addPoints(vertices: Float32Array|number[], metadata: any) {
        for(let i = 0; i < vertices.length; i += 3) {
            this.positions.push(vertices[i], vertices[i + 1], vertices[i + 2]);
            this.centroidAcc[0] += vertices[i];
            this.centroidAcc[1] += vertices[i + 1];
            this.centroidAcc[2] += vertices[i + 2];
        }

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
        if (buffers === undefined)
            return [];
        return [buffers.positions.buffer, buffers.ids.buffer];
    }

    toBuffers() {
        if (this.positions.length === 0)
            return undefined;

        const l = this.positions.length / 3;

        return {
            positions: new Float32Array(this.positions),
            ids: new Float32Array(this.ids),
            metadata: this.metadata,
            centroid: [this.centroidAcc[0] / l, this.centroidAcc[1] / l, this.centroidAcc[2] / l],
            type: PointsAssembler.type
        };
    }
}