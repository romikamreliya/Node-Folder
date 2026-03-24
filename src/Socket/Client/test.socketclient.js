const BaseSocket = require("../../common/baseSocket");

class testSocketClient extends BaseSocket {
    constructor({socketClient,appEvent}){
        super();
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

module.exports = testSocketClient;