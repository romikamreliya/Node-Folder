const fs = require("fs");

/**
 * Logger utility class for file-based logging
 */
class LoggerUtils {

    static date = (new Date().toLocaleDateString()).replaceAll('/', '_');

    /**
     * Check if log file exists for today
     * @returns {boolean} True if log file exists
     */
    static fileCheck() {
        const files = fs.readdirSync('./logs');
        return files.includes(`${this.date}.log`);
    }

    /**
     * Extract error details from error object
     * @param {Error} error - Error object
     * @returns {Object} Error details with file, line, and message
     */
    static extractLineNumber(error) {
        const stackTrace = error.stack || '';
        const matches = stackTrace.match(/at\s+(.+)\s+\((.+):(\d+):(\d+)\)/);

        if (matches && matches.length >= 5) {
            return {
                fileName: `${matches[2]}`,
                line: `Error in function '${matches[1]}' in line ${matches[3]}, column ${matches[4]}`,
                message: error.message || ""
            };
        }

        return error.message || "";
    }

    /**
     * Create log entry in file or console
     * @param {Object} options - Log options
     * @param {Error|string} options.msg - Error message or object
     * @param {string} [options.name=""] - Log name/label
     */
    static createLog({ msg, name = "" }) {
        if (process.env.DEBUG === "true") {
            console.log(`------------ ${name} -----------------`);
            console.log(msg);
            console.log(`-----------------------------`);
            return;
        }

        if (msg?.name === "Error") {
            return;
        }

        const errorObject = this.extractLineNumber(msg);
        const fileCheck = this.fileCheck();

        const data = `\n========================= ${new Date().toLocaleTimeString()} ${name} =====================================\n ${JSON.stringify(errorObject, null, 2)}`;
        if (fileCheck) {
            fs.appendFileSync(`./logs/${this.date}.log`, data);
        } else {
            fs.writeFileSync(`./logs/${this.date}.log`, data);
        }
    }
}

module.exports = LoggerUtils;