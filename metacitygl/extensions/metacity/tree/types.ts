

export interface SubTreeQuery {
    array?: Float32Array;
    filled: number;
}

export interface TreeQuery extends SubTreeQuery {
    tilesToLoad: {
        name: string;
        size: number;
        model: SubTreeQuery;
    }[];
}

export interface TreeConfig {
    loadingRadius?: number;
    requestTileRadius?: number;
    distFactor?: number;
    distZFactor?: number;
    radFactor?: number;
    visualizeTree?: boolean;
    zOffset?: number;
}

export interface TreeWorkerInitInput {
    api: string;
    styles: string[];
    color: number;
    config: TreeConfig
}

export interface TreeWorkerOutput extends TreeQuery {}

export interface QuadrantData {
    z: [number, number];
    metadata?: {
        [key: string]: number|string;
    }
    sw?: QuadrantData;
    se?: QuadrantData;
    nw?: QuadrantData;
    ne?: QuadrantData;
    file?: string;
    size: number;
}

export interface QuadTreeData extends QuadrantData {
    border: {
        min: [number, number];
        max: [number, number];
    }
}