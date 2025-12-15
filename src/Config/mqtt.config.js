const mqtt = require("mqtt");

class MQTTConfig {
    constructor({ url, name }) {
        this.name = name;
        this.mqtt = mqtt.connect(url);
        this.initialize();
    }
    initialize() {
        console.log(`MQTT ${this.name} Config Successfully`);
    }
}

module.exports = MQTTConfig;
