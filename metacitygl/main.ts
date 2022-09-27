

export function hello() {
    console.log("Hello World!");
    const worker = new Worker(new URL('./worker', import.meta.url), { type: 'module' });
    worker.postMessage('hi');
}