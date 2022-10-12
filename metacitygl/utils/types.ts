
export interface LineData {
    positions: Float32Array;
    colors: Uint8Array;
    ids?: Uint8Array;
}

export interface MeshData {
    positions: Float32Array;
    dots: Float32Array;
    ids?: Uint8Array;
    colors?: Uint8Array;
} 

export interface AgentData {
    positions: Float32Array[];
    visible: Float32Array[];
    timestamps: Float32Array;
    colors: Uint8Array;
    dimensions: Float32Array; //questionalbe, would be nice to remove
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

export interface InstancedMeshData {
    instancePositions: Float32Array;
    instanceDots: Uint8Array;
    positions: Float32Array;
}

export interface InstancedPointData extends InstancedMeshData {
    centroid: [number, number, number];
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