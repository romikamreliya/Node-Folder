const HelperUtils = require("../Utils/helper.utils");
const LoggerUtils = require("../Utils/logger.utils");
const AjvUtils = require("../Utils/ajv.utils");
const tokenUtils = require("../Utils/token.utils");

class TestSocketClient{
    constructor({socketClient,appEvent}){

        this.helper = HelperUtils;
        this.logger = LoggerUtils;
        this.ajv = AjvUtils;
        this.token = tokenUtils;

        this.socketClient = socketClient;
        this.appEvent = appEvent;
        this.initialize();
    }
    initialize() {
        this.setupSocketListeners();
        this.setupAppEventListeners();
    };
    setupSocketListeners() {
        this.socketClient.emit('room', null);

        this.socketClient.on('message',(data)=>{
            console.log('message',data)
            this.appEvent.emit("socketEmit",data)
        })
        this.socketClient.on('participants',(data)=>{
            console.log('participants',data)
        })
    }
    setupAppEventListeners() {
        this.appEvent.on('socketEmit', (data) => {
            console.log('socket socketEmit', data);
        })
    }
}

module.exports = TestSocketClient;