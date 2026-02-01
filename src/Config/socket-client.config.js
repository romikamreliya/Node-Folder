const socketClient = require("socket.io-client");

class SocketClientConfig {
    constructor({ url, name }) {
        this.name = name;
        this.client = socketClient.io(url);
        this.initialize();
    }
    initialize() {
        console.log(`✓ App Socket Client ${this.name} Config Initialized Successfully`);
    }
}

module.exports = SocketClientConfig;
