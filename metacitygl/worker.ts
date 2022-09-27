import { hi } from './workerB'

self.onmessage = function (e) {
    console.log('Worker: Message received from main script');
    const workerResult = 'Result: ' + (e.data) + hi();
    console.log('Worker: Posting message back to main script');
    self.postMessage(workerResult);
}

