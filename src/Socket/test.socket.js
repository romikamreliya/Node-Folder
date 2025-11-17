class TestSocket{
    constructor({socket, io, eventEmitter}){
        this.socket = socket;
        this.io = io;
        this.eventEmitter = eventEmitter;
        this.connection();
        this.eventEmitterHandel();
    }
    connection = () => {
        console.log('connection');
        // this.socket.join("a") // connect room
        this.socketEmit();
    }
    socketEmit = () => {
        this.socket.on('send',(data)=>{
            this.io.emit('send',`${data} - server`)
        })
    }

    eventEmitterHandel = () => [
        this.eventEmitter.on('socketEmit', (data) => {
            console.log('socket socketEmit', data);
            this.io.emit('send',data)
        })
    ]

}

module.exports = TestSocket;