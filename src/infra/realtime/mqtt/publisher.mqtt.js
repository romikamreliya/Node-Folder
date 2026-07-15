const BaseMqtt = require("../../../common/base/base-mqtt");

class MqttPublisher extends BaseMqtt {
  constructor({ conn, appEvent }) {
    super();
    this.mqtt = conn;
    this.appEvent = appEvent;
    this.setupAppEventListeners();
  }

  telemetryStatistic() {
    this.mqtt.publish(
      `bms/v1/123456/telemetry/statistic`,
      JSON.stringify({ timestamp: "2025-07-26T16:00:00Z" }),
    );
  }
  setupAppEventListeners() {
    this.appEvent.on(this.appEvent.EVENTS.SOCKET_EMIT, (data) => {
      this.mqtt.publish(`bms/v1/123456/test`, JSON.stringify(data));
    });
  }
}

module.exports = MqttPublisher;
