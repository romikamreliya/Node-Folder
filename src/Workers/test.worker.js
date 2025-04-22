const { parentPort, workerData } = require('worker_threads');

function slowFib(n) {
  return n <= 1 ? n : slowFib(n - 1) + slowFib(n - 2);
}

const result = slowFib(workerData);
parentPort.postMessage(result);
