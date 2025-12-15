const lodash = require("lodash");
const commonConst = require("./commonConst");

class HelperUtils {

  static commonConst = new commonConst();

  static getVersion({url}) { 
    const match = url.match(/\/api\/(v1|v2)/); 
    return match ? match[1] : null; 
  }

}

module.exports = HelperUtils;
