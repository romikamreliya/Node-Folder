class TestSocketClient{
    constructor({socketClient,eventEmitter}){
        this.socketClient = socketClient;
        this.event = eventEmitter;
        this.socketEmit();
    }
    socketEmit = () => {
        this.socketClient.emit('room', null);

        this.socketClient.on('message',(data)=>{
            console.log('message',data)
            this.event.emit("socketEmit",data)
        })
        this.socketClient.on('participants',(data)=>{
            console.log('participants',data)
        })
    }
}

module.exports = TestSocketClient;