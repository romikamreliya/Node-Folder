const socketClient = require("socket.io-client");

class SocketClientConfig {
    constructor({ url, name }) {
        this.name = name;
        this.client = socketClient.io(url);
        this.initialize();
    }
    initialize() {
        console.log(`Socket Client ${this.name} Config Successfully`);
    }
}

module.exports = SocketClientConfig;
