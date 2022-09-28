import MyWorker from './worker?worker&inline'

export function hello() {
    console.log("Hello World!");
    const worker = new MyWorker();
    worker.postMessage('hi');
}