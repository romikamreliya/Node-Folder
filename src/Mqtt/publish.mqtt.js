const BaseMqtt = require("../common/baseMqtt");

class publishMqtt extends BaseMqtt{
    constructor({conn, appEvent}) {
        super();
        this.mqtt = conn;
        this.appEvent = appEvent;
        this.setupAppEventListeners();
    }

    telemetryStatistic() {
        this.mqtt.publish(`bms/v1/123456/telemetry/statistic`, JSON.stringify({"timestamp": "2025-07-26T16:00:00Z"}))
    }
    setupAppEventListeners() {
        this.appEvent.on('socketEmit', (data) => {
            this.mqtt.publish(`bms/v1/123456/test`, JSON.stringify(data))
        })
    }
}

module.exports = publishMqtt;