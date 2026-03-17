const helperUtils = require("../utils/helper.utils");
const loggerUtils = require("../utils/logger.utils");
const ajvUtils = require("../utils/ajv.utils");

class publishMqtt {
    constructor({conn, appEvent}) {

        this.helper = helperUtils;
        this.logger = loggerUtils;
        this.ajv = ajvUtils;

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