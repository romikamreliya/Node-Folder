const logs = require("../Utils/logs");
const { Worker } = require('worker_threads');

class mainWorker {

    testWorker = (data) => {
        try {
            const worker = new Worker('./test.worker.js', {
                workerData: data
            });
            
            worker.on('message', (result) => {
                console.log('Result from worker:', result);
            });
            
            worker.on('error', (err) => {
                console.log('Worker error:', err);
            });
        } catch (error) {
            logs.createLog(error, 'test worker');
        }
    }
  
}

module.exports = mainWorker;
