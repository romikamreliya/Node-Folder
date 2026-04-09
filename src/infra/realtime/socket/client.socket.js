const BaseSocket = require("../../../common/base/base-socket");

class AppSocketClient extends BaseSocket {
  constructor({ socketClient, appEvent }) {
    super();
    this.socketClient = socketClient;
    this.appEvent = appEvent;
    this.initialize();
  }
  initialize() {
    this.setupSocketListeners();
    this.setupAppEventListeners();
  }
  setupSocketListeners() {
    this.socketClient.emit("room", null);

    this.socketClient.on("message", (data) => {
      console.log("message", data);
      this.appEvent.emit("socketEmit", data);
    });
    this.socketClient.on("participants", (data) => {
      console.log("participants", data);
    });

    this.socketClient.on("disconnect", (reason) => {
      console.log("disconnect", reason);
    });
  }
  setupAppEventListeners() {
    this.appEvent.on("socketClientEmit", (data) => {
      console.log("socket socketClientEmit", data);
    });
  }
}

module.exports = AppSocketClient;
