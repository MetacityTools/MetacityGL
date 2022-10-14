export interface GLTFLoaderInput {
    pointInstanceModel: string;
}

export interface GLTFWorkerInput extends GLTFLoaderInput {}

export interface GLTFLoaderOutput {
    positions: Float32Array;
    dots: Float32Array;
}