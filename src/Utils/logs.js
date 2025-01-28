const fs = require("fs");

class Logs{

    constructor(){
        this.date = (new Date().toLocaleDateString()).replaceAll('/','_');
    }

    fileCheck = () => {
        const files = fs.readdirSync('./logs');
        return files.includes(`${this.date}.log`);
    }

    extractLineNumber = (error) => {
        
        const stackTrace = error.stack || '';
        const matches = stackTrace.match(/at\s+(.+)\s+\((.+):(\d+):(\d+)\)/);
    
        if (matches && matches.length >= 5) {
            return {
                fileName: `${matches[2]}`,
                line : `Error in function '${matches[1]}' in line ${matches[3]}, column ${matches[4]}`,
                message: error.message || ""
            };
        }
    
        return error.message || "";
    }

    createLog = (msg, name = "") => {
        
        const errorObject = this.extractLineNumber(msg);
        const fileCheck = this.fileCheck();

        let data = `\n========================= ${new Date().toLocaleTimeString()} ${name} =====================================\n ${JSON.stringify(errorObject, null, 2)}`;
        if (fileCheck) {
            fs.appendFileSync('./logs/'+this.date+'.log', data);
        }else {
            fs.writeFileSync('./logs/'+this.date+'.log', data);
        }
    }

}

module.exports = new Logs();