const lodash = require("lodash");
const commonConst = require("./commonConst");

class Helper extends commonConst{
  
  constructor() {
    super();
  }

  resMessage = (msg, len = this.commandLen) => {
    const msgLen = require(`../Language/${len}/message.js`);
    if (msgLen[msg]) {
      return msgLen[msg]
    } else {
      const defLen = require(`../Language/${this.commandLen}/message.js`);
      return defLen[msg] ?? msg;
    }
  };
  
}

module.exports = Helper;
