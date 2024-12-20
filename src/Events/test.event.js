module.exports = class TestEvent{

    constructor(eventEmitter){
        this.eventEmitter = eventEmitter;
        this.events();
    }
    events = () => {
        this.eventEmitter.on('test',(data)=>{
            console.log('test events :-',data);
        })
    }

}