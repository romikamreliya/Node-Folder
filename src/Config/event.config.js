const EventEmitter = require("events");

class AppEventEmitter extends EventEmitter {
    constructor() {
        super();
        this.EVENTS = {
            SOCKET_EMIT: "socketEmit",
            SOCKET_CLIENT_EMIT: "socketClientEmit",
        };
    }

    emit(event, ...args) {
        if (!Object.values(this.EVENTS).includes(event)) {
            console.warn(
                `[EventBus] Unknown event emitted: "${event}". Register it in event.contracts.js`,
            );
        }
        return super.emit(event, ...args);
    }

    on(event, listener) {
        if (!Object.values(this.EVENTS).includes(event)) {
            console.warn(
                `[EventBus] Unknown event subscribed: "${event}". Register it in event.contracts.js`,
            );
        }
        return super.on(event, listener);
    }
}

module.exports = new AppEventEmitter();
