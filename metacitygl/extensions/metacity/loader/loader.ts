import { WorkerPool } from "../../../utils";
import { MetacityLoaderInput, MetacityLoaderOutput, MetacityWorkerInput } from "./types";
import MetacityWorker from "./worker?worker&inline";


export class MetacityLoader {
    private workerPool: WorkerPool<MetacityWorkerInput, MetacityLoaderOutput>;
    private idOffset: number = 0;

    constructor() {
        this.workerPool = new WorkerPool(MetacityWorker, 8);
    }

    load(data: MetacityLoaderInput, callback: (output: MetacityLoaderOutput) => void) {
        this.workerPool.process({
            url: data.url,
            idOffset: this.idOffset,
            color: data.color,
            styles: data.styles,
        }, callback);

        this.idOffset += data.tileSize;
    }
}