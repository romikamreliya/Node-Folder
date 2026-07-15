const { Worker } = require("worker_threads");
const BaseWorker = require("../../common/base/base-worker");

const path = require("path");
class WorkerRunner extends BaseWorker {
  constructor() {
    super();
  }

  executeWorker(data) {
    return new Promise((resolve, reject) => {
      try {
        const worker = new Worker(path.join(__dirname, "fibonacci.worker.js"), {
          workerData: data,
        });

        worker.on("message", (result) => {
          resolve(result);
        });

        worker.on("error", (err) => {
          this.logger.createLog(err,"testWorker");
          reject(err);
        });

        worker.on("exit", (code) => {
          if (code !== 0) {
            const error = new Error(`Worker stopped with exit code ${code}`);
            this.logger.createLog(error,"testWorker exit");
            reject(error);
          }
        });
      } catch (error) {
        this.logger.createLog(error,"testWorker exit");
        reject(error);
      }
    });
  }
}

module.exports = WorkerRunner;
