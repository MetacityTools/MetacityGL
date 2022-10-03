import { colorHex } from "../utils/color";


export class PointsAssembler {
    positions: number[] = [];
    ids: number[] = [];

    static readonly type = "points";

    constructor(private id = 1) {}

    addPoint(x: number, y: number, z: number) {
        this.positions.push(x, y, z);
        const idcolor = colorHex(this.id);
        this.ids.push(idcolor[0], idcolor[1], idcolor[2]);
    }

    pickTransferables(buffers: any) {
        return [buffers.positions.buffer, buffers.ids.buffer];
    }

    toBuffers() {
        return {
            positions: new Float32Array(this.positions),
            ids: new Float32Array(this.ids),
            type: PointsAssembler.type
        };
    }
}