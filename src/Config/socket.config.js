const { Server } = require("socket.io");
const Constants = require("../common/utils/constants");

class SocketConfig {
  constructor({ server }) {
    // Build CORS configuration with allowed origins
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);

    this.io = new Server(server, this.getConfig(allowedOrigins)).of("/");
    this.initialize();
  }

  getConfig(allowedOrigins = []) {
    return {
      maxHttpBufferSize: Constants.socket.maxHttpBufferSize,
      cors: {
        origin: allowedOrigins.length > 0 ? allowedOrigins : true,
        credentials: true,
        methods: ["GET", "POST"],
      },
    };
  }

  initialize() {
    console.log("✓ App Socket Config Initialized Successfully");
  }
}

module.exports = SocketConfig;
