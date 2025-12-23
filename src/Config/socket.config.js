const { Server } = require("socket.io");

class SocketConfig {
    constructor({ server }) {
        this.io = new Server(server).of("/");
        // this.io.use(this.auth);
        this.initialize();
    }
    auth(socket, next) {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('Authentication required'));
        
        try {
            const tokenData = TokenUtils.verifyCustomToken(token);
            if (!tokenData.ok) return next(new Error('Invalid token'));
            socket.userId = tokenData.data.userId;
            next();
        } catch (error) {
            next(error);
        }
    }
    initialize() {
        console.log('Socket Config Successfully');
    }
}

module.exports = SocketConfig;
