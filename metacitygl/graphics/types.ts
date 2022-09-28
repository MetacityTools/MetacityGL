
export interface LineData {
    positions: Float32Array;
    colors: Float32Array;
    ids?: Float32Array;
}

export interface MeshData {
    positions: Float32Array;
    normals: Float32Array;
    ids?: Float32Array;
    colors?: Float32Array;
} 

export class vec3 {
    constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}
    set(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
}