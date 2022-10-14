

export interface TreeModel {
    array?: Float32Array;
    filled: number;
}

export interface TreeGeometry extends TreeModel {
    tilesToLoad: {
        name: string;
        size: number;
        model: TreeModel;
    }[];
}

export interface TreeWorkerInitInput {
    api: string;
    styles: string[];
    color: number;
}

export interface TreeWorkerOutput extends TreeGeometry {}

export interface TreeQuadrantData {
    z: [number, number];
    metadata: {
        [key: string]: number|string;
    }
    sw?: TreeQuadrantData;
    se?: TreeQuadrantData;
    nw?: TreeQuadrantData;
    ne?: TreeQuadrantData;
    file?: string;
    size: number;
}

export interface TreeData extends TreeQuadrantData {
    border: {
        min: [number, number];
        max: [number, number];
    }
}