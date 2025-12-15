const EventEmitter = require("events");

class AppEventEmitter extends EventEmitter {
  constructor() {
    super();
  }
}

module.exports = new AppEventEmitter(); // singleton
