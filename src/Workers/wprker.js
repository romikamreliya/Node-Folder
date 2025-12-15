// const logs = require("../Utils/logs");
// const { Worker } = require('worker_threads');

// class mainWorker {

//     testWorker = (data) => {
//         try {
//             const worker = new Worker('./test.worker.js', {
//                 workerData: data
//             });
            
//             worker.on('message', (result) => {
//                 console.log('Result from worker:', result);
//             });
            
//             worker.on('error', (err) => {
//                 console.log('Worker error:', err);
//             });
//         } catch (error) {
//             logs.createLog(error, 'test worker');
//         }
//     }
  
// }

// module.exports = mainWorker;


const { Worker } = require('worker_threads');
const HelperUtils = require("../Utils/helper.utils");
const LoggerUtils = require("../Utils/logger.utils");

const path = require('path');
class mainWorker {
    constructor() {
        this.helper = HelperUtils;
        this.logger = LoggerUtils;
    }

    testWorker = (data) => {
        return new Promise((resolve, reject) => {
            try {
                const worker = new Worker(path.join(__dirname, 'test.worker.js'), {workerData: data});
                
                worker.on('message', (result) => {
                    resolve(result);
                });
                
                worker.on('error', (err) => {
                    this.logger.createLog({msg:err, name:"testWorker"});
                    reject(err);
                });
                
                worker.on('exit', (code) => {
                    if (code !== 0) {
                        const error = new Error(`Worker stopped with exit code ${code}`);
                        this.logger.createLog({msg:error, name:"testWorker exit"});
                        reject(error);
                    }
                });
                
            } catch (error) {
                this.logger.createLog({msg:error, name:"testWorker exit"});
                reject(error);
            }
        });
    }
}

module.exports = mainWorker;