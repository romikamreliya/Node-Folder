const helperUtils = require("../../utils/helper.utils");
const loggerUtils = require("../../utils/logger.utils");
const tokenUtils = require("../../utils/token.utils");

class testSocket {
    constructor({ socket, appEvent }) {
        this.helper = helperUtils;
        this.logger = loggerUtils;
        this.token = tokenUtils;

        this.socket = socket;
        this.appEvent = appEvent;
        this.authenticate();
    }

    authenticate() {
        try {
            const token = this.socket.handshake.auth.token;

            if (!token) {
                this.socket.disconnect(true);
                return;
            }

            // Verify JWT token
            const decoded = this.token.verifyCustomToken(token);
            this.user = decoded;

            this.initialize();
        } catch (error) {
            this.socket.emit("auth_error", {
                message: "Authentication failed",
                error: error.message,
            });
            this.socket.disconnect(true);
            this.appEventRemoveListeners();
        }
    }

    initialize() {
        this.setupSocketListeners();
        this.setupAppEventListeners();
    }

    setupSocketListeners() {

        this.socket.on("send", (data) => {
            this.socket.emit("send", `${data} - server`);
        });

        this.socket.on("error", (error) => {
            this.logger.error("Socket error:", error);
        });

        this.socket.on("disconnect", (reason) => {
            console.log(`Socket disconnected: ${reason}`);
            this.appEventRemoveListeners();
        });
    }

    setupAppEventListeners() {
        this.socketEmitHandler = (data) => {
            console.log('socket socketEmit', data);
            this.socket.emit('send', data);
        };
        this.appEvent.on('socketEmit', this.socketEmitHandler);
    }

    appEventRemoveListeners() {
        if (this.socketEmitHandler) {
            this.appEvent.removeListener('socketEmit', this.socketEmitHandler)   
        }
    }
}

module.exports = testSocket;
