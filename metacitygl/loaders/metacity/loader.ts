import { WorkerPool } from "../pool";
import { MetacityLoaderInput, MetacityLoaderOutput, MetacityWorkerInput } from "./types";
import MetacityWorker from "./worker?worker&inline";


export class MetacityLoader {
    private workerPool: WorkerPool<MetacityWorkerInput, MetacityLoaderOutput>;
    private idOffset: number = 0;

    constructor() {
        this.workerPool = new WorkerPool(MetacityWorker, 4);
    }

    load(data: MetacityLoaderInput, callback: (output: MetacityLoaderOutput) => void) {
        this.workerPool.process({
            url: data.url,
            idOffset: this.idOffset,
        }, callback);

        this.idOffset += data.tileSize;
    }
}