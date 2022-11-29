import { computeBBox } from "../utils/bbox";
import { colorHexToArr255 } from "../utils/color";


export class PointsAssembler {
    positions: number[] = [];
    ids: number[] = [];
    metadata: {[id: number]: any} = {};
    private centroidAcc = [0, 0, 0];

    static readonly type = "points";
    constructor(private id = 1, private useMetadata: boolean = false) {
    }

    addPoints(vertices: Float32Array|number[], metadata?: any) {
        for(let i = 0; i < vertices.length; i += 3) {
            this.positions.push(vertices[i], vertices[i + 1], vertices[i + 2]);
            this.centroidAcc[0] += vertices[i];
            this.centroidAcc[1] += vertices[i + 1];
            this.centroidAcc[2] += vertices[i + 2];
        }

        if (this.useMetadata) {
            const vertexCount = vertices.length / 3;
            const idcolor = colorHexToArr255(this.id);
            for (let i = 0; i < vertexCount; i++) {
                this.ids.push(idcolor[0], idcolor[1], idcolor[2]);
            }
            const bbox = computeBBox(vertices);
            metadata["height"] = bbox[1][2] - bbox[0][2];
            this.metadata[this.id++] = metadata;   
        }
    }

    pickTransferables(buffers: any) {
        let transferables: any[] = [];

        if (buffers === undefined)
            return transferables;

        transferables.push(buffers.positions.buffer);
        if (buffers.ids !== undefined)
            transferables.push(buffers.ids.buffer);

        return transferables;
    }

    toBuffers() {
        if (this.positions.length === 0)
            return undefined;

        const l = this.positions.length / 3;

        return {
            positions: new Float32Array(this.positions),
            centroid: [this.centroidAcc[0] / l, this.centroidAcc[1] / l, this.centroidAcc[2] / l],
            ids: this.useMetadata ? new Uint8Array(this.ids) : undefined,
            metadata: this.useMetadata ? this.metadata : undefined,
            type: PointsAssembler.type
        };
    }
}