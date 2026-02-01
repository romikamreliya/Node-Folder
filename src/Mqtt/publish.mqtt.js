const HelperUtils = require("../Utils/helper.utils");
const LoggerUtils = require("../Utils/logger.utils");
const AjvUtils = require("../Utils/ajv.utils");

class PublishMqtt {
    constructor({conn, appEvent}) {

        this.helper = HelperUtils;
        this.logger = LoggerUtils;
        this.ajv = AjvUtils;

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

module.exports = PublishMqtt;