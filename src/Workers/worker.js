const { Worker } = require('worker_threads');
const BaseController = require("../common/baseController");

const path = require('path');
class mainWorker extends BaseController {
    constructor() {
        super();
    }

    executeWorker(data) {
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