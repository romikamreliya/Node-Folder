class TestSocket{
    constructor(socket, io){
        this.socket = socket;
        this.io = io;
        this.connection();
    }
    connection = () => {
        console.log('connection');
        this.socketemit();
    }
    socketemit = () => {
        this.socket.on('send',(data)=>{
            this.socket.emit('send',`${data} - server`)
        })
    }
}

module.exports = TestSocket;