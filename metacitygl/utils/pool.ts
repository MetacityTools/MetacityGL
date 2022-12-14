interface Job<JobType> {
    data: JobType,
    jobID: number
}

interface QueueItem<JobType> {
    next: QueueItem<JobType> | undefined,
    value: Job<JobType>
}

class Queue<JobType> {
    head: QueueItem<JobType> | undefined;
    tail: QueueItem<JobType> | undefined;
    
    constructor() {}
        
    enqueue(value: Job<JobType>) { 
        const link = { value, next: undefined };

        if (this.tail) 
            this.tail.next = link
        this.tail = link;

        if (!this.head) 
            this.head = link;
    }

    dequeue() {
        if (this.head) {
            const value = this.head.value;
            this.head = this.head.next;
            return value;
        }
    }

    peek() { return this.head?.value; }
}

export class WorkerPool<InputType, ResultType> {
    workers: Worker[];
    workerBusy: boolean[];
    workerJob: number[];
    resultMap: Map<number, CallableFunction>;
    queue: Queue<InputType>;
    jobIDs: number;

    constructor(private Worker: { new(): Worker ;}, private poolsize: number) {
        this.workers = new Array(poolsize).fill(undefined);
        this.workerBusy = new Array(poolsize).fill(false);
        this.workerJob = new Array(poolsize).fill(-1);
        this.resultMap = new Map<number, CallableFunction>();
        this.queue = new Queue<InputType>();
        this.jobIDs = 0;
    }

    process(data: InputType, callback: (output: ResultType) => void) {
        const jobID = this.jobIDs++;
        this.resultMap.set(jobID, callback);

        this.queue.enqueue({
            data: data,
            jobID: jobID
        });

       this.submit();
    };

    private initWorker(i: number) {
        this.workers[i] = new this.Worker();
        
        this.workers[i].onmessage = (message) => {
            const callback = this.resultMap.get(this.workerJob[i]);
            if (callback) {
                callback(message.data);
                this.resultMap.delete(this.workerJob[i]);
            }
            this.workerBusy[i] = false;
            this.submit();
        };

        this.workerBusy[i] = false;
    }

    private get worker() {
        for (let i = 0; i < this.poolsize; ++i) {
            if (!this.workers[i])
                this.initWorker(i);

            if (!this.workerBusy[i])
                return i;
        }
    }

    submit() {
        const i = this.worker;
        if (i === undefined)
            return;

        const job = this.queue.dequeue();
        if (!job)
            return;

        this.workerBusy[i] = true;
        this.workerJob[i] = job.jobID;
        this.workers[i].postMessage(job.data);
    }
}
