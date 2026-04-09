const BaseSocket = require("../../../common/base/base-socket");

class AppSocketServer extends BaseSocket {
  constructor({ appEvent, io }) {
    super();
    this.appEvent = appEvent;
    this.io = io;
    this.init();
    this.appEventHandler();
  }

  init() {
    this.io.on("connection", (socket) => {
      this.authenticate(socket);
    });
  }

  authenticate(socket) {
    try {
      // const token = socket.handshake.auth.token;

      // if (!token) {
      //     socket.disconnect(true);
      //     return;
      // }

      // // Verify JWT token
      // const decoded = this.token.verifyCustomToken(token);
      // this.user = decoded;

      this.socketEmitHandler(socket);
    } catch (error) {
      socket.emit("auth_error", {
        message: "Authentication failed",
        error: error.message,
      });
      socket.disconnect(true);
    }
  }

  socketEmitHandler(socket) {
    socket.on("send", (data) => {
      socket.emit("send", `${data} - server`);
    });

    socket.on("error", (error) => {
      this.logger.error("Socket error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${reason}`);
    });
  }

  appEventHandler() {
    this.appEvent.on("socketEmit", (data) => {
      console.log("socket socketEmit", data);
      this.io.emit("send", data);
    });
  }
}

module.exports = AppSocketServer;
