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
      const token = socket.handshake.auth.token;

      if (!token) {
        socket.disconnect(true);
        return;
      }

      // Verify token
      const decoded = this.token.verifyCustomToken(token);
      if (!decoded.ok) {
        socket.emit("auth_error", { message: "Invalid token" });
        socket.disconnect(true);
        return;
      }

      socket.user = decoded.data;
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
    this.appEvent.on(this.appEvent.EVENTS.SOCKET_EMIT, (data) => {
      console.log("socket socketEmit", data);
      this.io.emit("send", data);
    });
  }
}

module.exports = AppSocketServer;
