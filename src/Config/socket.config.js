const { Server } = require("socket.io");

class socketConfig {
    constructor({ server }) {
        this.io = new Server(server, this.config).of("/");
        this.initialize();
    }

    config = {
        cors: {
            origin: "*"
        }
    }

    initialize() {
        console.log('✓ App Socket Config Initialized Successfully');
    }
}

module.exports = socketConfig;
