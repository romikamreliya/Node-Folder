const HelperUtils = require("../../utils/helper.utils");
const LoggerUtils = require("../../utils/logger.utils");

class TestSocketClient{
    constructor({socketClient,appEvent}){

        this.helper = HelperUtils;
        this.logger = LoggerUtils;

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

        this.socketClient.on('disconnect',(reason)=>{
            console.log('disconnect',reason)
            this.appEventRemoveListeners();
        })
    }
    setupAppEventListeners() {
        this.socketClientEmit = (data) => {
            console.log('socket socketClientEmit', data);
        }
        this.appEvent.on('socketClientEmit', this.socketClientEmit);
    }

    appEventRemoveListeners() {
        if (this.socketClientEmit) {
            this.appEvent.removeListener('socketClientEmit', this.socketClientEmit)   
        }
    }
}

module.exports = TestSocketClient;