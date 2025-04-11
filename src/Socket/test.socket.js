class TestSocket{
    constructor(socket, io){
        this.socket = socket;
        this.io = io;
        this.connection();
    }
    connection = () => {
        console.log('connection');
        this.socketEmit();
    }
    socketEmit = () => {
        this.socket.on('send',(data)=>{
            this.socket.emit('send',`${data} - server`)
        })
    }
}

module.exports = TestSocket;