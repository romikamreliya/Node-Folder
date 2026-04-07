const { parentPort, workerData } = require("worker_threads");
const BaseWorker = require("../common/baseWorker");

class testWorker extends BaseWorker {
    constructor(data) {
        super();
        this.data = data;
    }

    calculate(n) {
        return n <= 1 ? n : this.calculate(n - 1) + this.calculate(n - 2);
    }

    execute() {
        try {
            const result = this.calculate(this.data);
            parentPort.postMessage({ success: true, result });
        } catch (error) {
            parentPort.postMessage({ success: false, error: error.message });
        }
    }
}

const worker = new testWorker(workerData);
worker.execute();