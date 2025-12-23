const mqtt = require("mqtt");

class MQTTConfig {
    constructor({ url, name }) {
        this.name = name;
        this.mqtt = mqtt.connect(url);
        this.initialize();
        this.setupErrorHandling();
    }
    initialize() {
        console.log(`MQTT ${this.name} Config Successfully`);
    }
    setupErrorHandling() {
        this.mqtt.on('error', (error) => {
            console.error('MQTT Connection error:', error);
        });
    }
}

module.exports = MQTTConfig;
