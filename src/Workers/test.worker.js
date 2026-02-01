const { parentPort, workerData } = require("worker_threads");
const HelperUtils = require("../Utils/helper.utils");
const LoggerUtils = require("../Utils/logger.utils");

class TestWorker {
    constructor(data) {
      this.helper = HelperUtils;
      this.logger = LoggerUtils;
      
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

const worker = new TestWorker(workerData);
worker.execute();