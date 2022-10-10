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
    //TODO
}