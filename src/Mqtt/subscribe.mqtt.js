const Helper = require("../Utils/helper")

class subscribeMqtt extends Helper {
    constructor({conn}) {
        super();
        this.mqtt = conn;
        this.subscribeMqttTopic();
        this.connection();
    }

    subscribeMqttTopic = () => {
        this.mqtt.subscribe(`bms/v1/+/telemetry/statistic`, (err) => {
            console.log('bms/v1/+/telemetry/statistic',err);
        })
    }

    connection = () => {
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

    telemetryStatistic = async (data, serialNumber) => {
        try {
            
            console.log("data",data);
            

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = subscribeMqtt;