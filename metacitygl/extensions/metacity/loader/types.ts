export interface MetacityLoaderInput {
    url: string;
    tileSize: number;
    color: number;
    styles: string[];
}

export interface MetacityWorkerInput {
    url: string;
    idOffset: number;
    color: number;
    styles: string[];
}

export interface MetacityLoaderOutput {
    mesh?: {
        positions: Float32Array;
        normals: Float32Array;
        colors: Float32Array;
        ids: Float32Array;
        metadata: {
            [id: number]: any;
        };
        type: string;
    },
    points?: {
        positions: Float32Array;
        ids: Float32Array;
        centroid: [number, number, number];
        metadata: {
            [id: number]: any;
        };
        type: string;
    }
}