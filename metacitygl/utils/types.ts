
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

export interface AgentData {
    positions: Float32Array[];
    visible: Float32Array[];
    timestamps: Float32Array;
    colors: Float32Array;
    dimensions: Float32Array;
}

export interface MovementData {
    attrStart: THREE.InstancedBufferAttribute;
    attrEnd: THREE.InstancedBufferAttribute;
    attrVisible: THREE.InstancedBufferAttribute;
    colors: THREE.InstancedBufferAttribute;
    dimensions: THREE.InstancedBufferAttribute;
    instance: THREE.BufferGeometry;
}

export interface PointData {
    positions: Float32Array;
}

export interface GridData {
    from: [number, number],
    to: [number, number],
    z: number,
    major: number,
    divideMajor: number,
    color: number,
    thickness?: number
}

export type Metadata = {
    [key: number]: MetadataRecord
}

export type MetadataRecord = {
    [key: string]: any
}

export interface vec3 {
    x: number;
    y: number;
    z: number;
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