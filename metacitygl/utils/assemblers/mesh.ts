import { computeBBox } from "../utils/bbox";
import { colorHexToArr } from "../utils/color";
import { computeDots } from "../utils/normals";



export class MeshAssembler {
    positions: number[] = [];
    colors: number[] = [];
    ids: number[] = [];
    metadata: {[id: number]: any} = {};

    static readonly type = "mesh";  

    constructor(private id = 1, private useMetadata = false) {}

    addMesh(vertices: Float32Array|number[], rgb: number[], metadata: any = {}) {
        for(let i = 0; i < vertices.length; i++)
            this.positions.push(vertices[i]);
            
            
        const vertexCount = vertices.length / 3;
        for (let i = 0; i < vertexCount; i++) {
            this.colors.push(rgb[0], rgb[1], rgb[2]);
        }

        if (this.useMetadata) {
            const idcolor = colorHexToArr(this.id);
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
        transferables.push(buffers.dots.buffer);
        transferables.push(buffers.colors.buffer);
        if (buffers.ids !== undefined)
            transferables.push(buffers.ids.buffer);

        return transferables;
    }

    get idCounter() {
        return this.id;
    }

    toBuffers() {
        if (this.positions.length === 0)
            return undefined;
            
        return {
            positions: new Float32Array(this.positions),
            dots: computeDots(this.positions),
            colors: new Uint8Array(this.colors),
            ids: this.useMetadata ? new Uint8Array(this.ids) : undefined,
            metadata: this.useMetadata ? this.metadata : undefined,
            type: MeshAssembler.type
        };
    }
}