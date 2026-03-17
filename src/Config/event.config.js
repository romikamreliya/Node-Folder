const EventEmitter = require("events");

class appEventEmitter extends EventEmitter {
  constructor() {
    super();
  }
}

module.exports = new appEventEmitter();
