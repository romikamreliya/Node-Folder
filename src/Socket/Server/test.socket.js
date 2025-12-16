const HelperUtils = require("../../Utils/helper.utils");
const LoggerUtils = require("../../Utils/logger.utils");
const AjvUtils = require("../../Utils/ajv.utils");
const tokenUtils = require("../../Utils/token.utils");


class TestSocket{
    constructor({socket, io, appEvent}){

        this.helper = HelperUtils;
        this.logger = LoggerUtils;
        this.ajv = AjvUtils;
        this.token = tokenUtils;

        this.socket = socket;
        this.io = io;
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
            this.socket.emit('auth_error', {
                message: 'Authentication failed',
                error: error.message
            });
            this.socket.disconnect(true);
        }
    }
    
    initialize() {
        this.setupSocketListeners();
        this.setupAppEventListeners();
    }
    
    setupSocketListeners() {
        this.socket.on('send',(data)=>{
            this.io.emit('send',`${data} - server`)
        })
    }

    setupAppEventListeners() {
        this.appEvent.on('socketEmit', (data) => {
            console.log('socket socketEmit', data);
            this.io.emit('send',data)
        })
    }

}

module.exports = TestSocket;