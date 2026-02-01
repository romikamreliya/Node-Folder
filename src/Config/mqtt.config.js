const mqtt = require("mqtt");

class MQTTConfig {
    constructor({ url, name }) {
        this.name = name;
        this.mqtt = mqtt.connect(url);
        this.initialize();
        this.setupErrorHandling();
    }
    initialize() {
        console.log(`✓ App MQTT ${this.name} Config Initialized Successfully`);
    }
    setupErrorHandling() {
        this.mqtt.on('error', (error) => {
            console.error('MQTT Connection error:', error);
        });
    }
}

module.exports = MQTTConfig;
