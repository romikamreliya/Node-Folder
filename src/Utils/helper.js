const lodash = require("lodash");

class Helper {
  
  ResMessage = (msg, len = "en") => {
    const msglen = require(`../Language/${len}/message.js`);
    return msglen[msg] ?? msg;
  };
  
}

module.exports = new Helper();
