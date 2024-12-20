const fs = require("fs");

class Logs{

    constructor(){
        this.date = (new Date().toLocaleDateString()).replaceAll('/','_');
    }

    filechack = () => {
        const files = fs.readdirSync('./logs');
        return files.includes(`${this.date}.log`);
    }

    CreateLog = (msg, name = "") => {
        const filechack = this.filechack();
        let data = `\n========================= ${new Date().toLocaleTimeString()} ${name} =====================================\n ${msg}`;
        if (filechack) {
            fs.appendFileSync('./logs/'+this.date+'.log', data);
        }else {
            fs.writeFileSync('./logs/'+this.date+'.log', data);
        }
    }

}

module.exports = new Logs();