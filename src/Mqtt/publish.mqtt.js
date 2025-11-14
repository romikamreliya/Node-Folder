class publishMqtt {
    constructor({conn, event}) {
        this.mqtt = conn;
        this.event = event;
        setTimeout(() => {
            this.telemetryStatistic();
        }, 2000);
    }

    telemetryStatistic = () => {
        this.event.emit("test","ddssd")
        // this.factoryInfoDetails.map(j => {
        //     this.mqtt.publish(`bms/v1/${j}/telemetry/statistic`, JSON.stringify({"timestamp": "2025-07-26T16:00:00Z"}))
        // })
    }
}

module.exports = publishMqtt;