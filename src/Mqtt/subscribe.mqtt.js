const HelperUtils = require("../Utils/helper.utils");
const LoggerUtils = require("../Utils/logger.utils");
const AjvUtils = require("../Utils/ajv.utils");

class SubscribeMqtt{
    constructor({conn, appEvent}){

        this.helper = HelperUtils;
        this.logger = LoggerUtils;
        this.ajv = AjvUtils;
        
        this.mqtt = conn;
        this.appEvent = appEvent;
        
        this.subscribeMqttTopic();
        this.connection();
    }

    subscribeMqttTopic() {
        this.mqtt.subscribe(`bms/v1/+/telemetry/statistic`, (err) => {
            console.log('bms/v1/+/telemetry/statistic',err);
        })
    }

    connection() {
        this.mqtt.on("message", (topic, message) => {

            const topicKey = topic.match('bms\/v1\/([^\/]+)\/telemetry\/statistic')?.[1] ? 'telemetryStatistic': topic;

            switch (topicKey) {
                case "telemetryStatistic":
                    const getSerialNumber = topic.match('bms\/v1\/([^\/]+)\/telemetry\/statistic')[1];
                    this.telemetryStatistic(message.toString(),getSerialNumber)
                    break;
                default:
                    break;
            }
            console.log("⬅️ Received:", topic);
        });
    }

    async telemetryStatistic(data, serialNumber) {
        try {
            
            console.log("data",data);
            

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = SubscribeMqtt;