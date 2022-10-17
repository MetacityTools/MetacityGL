import { WorkerPool } from "../../utils";
import { GLTFLoaderInput, GLTFLoaderOutput, GLTFWorkerInput } from "./types";
import GLTFWorker from "./worker?worker&inline";


export class GLTFLoader {
    private workerPool: WorkerPool<GLTFWorkerInput, GLTFLoaderOutput>;

    constructor() {
        this.workerPool = new WorkerPool(GLTFWorker, 4);
    }

    load(data: GLTFLoaderInput, callback: (output: GLTFLoaderOutput) => void) {
        this.workerPool.process({
            pointInstanceModel: data.pointInstanceModel,
            baseURI: window.location.origin
        }, callback);
    }
}