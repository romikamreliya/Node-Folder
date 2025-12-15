const { Server } = require("socket.io");

class SocketConfig {
    constructor({ server }) {
        this.io = new Server(server).of("/");
        this.initialize();
    }
    initialize() {
        console.log('Socket Config Successfully');
    }
}

module.exports = SocketConfig;
