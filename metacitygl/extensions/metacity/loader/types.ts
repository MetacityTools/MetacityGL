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
        dots: Float32Array;
        colors: Uint8Array;
        ids: Uint8Array;
        metadata: {
            [id: number]: any;
        };
        type: string;
    },
    points?: {
        positions: Float32Array;
        ids: Uint8Array;
        metadata: {
            [id: number]: any;
        };
        centroid: [number, number, number];
        type: string;
    }
}