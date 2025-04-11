const lodash = require("lodash");

const commonConst = require("./commonConst");

class Helper extends commonConst{
  
  constructor() {
    super();
  }

  resMessage = (msg, len = "en") => {
    const msgLen = require(`../Language/${len}/message.js`);
    return msgLen[msg] ?? msg;
  };
  
}

module.exports = Helper;
