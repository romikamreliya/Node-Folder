require("dotenv").config();
const http = require("http");
const https = require("https");

const appConfig = require("../config/app.config");
const socketConfig = require("../config/socket.config");
const socketClientConfig = require("../config/socket-client.config");
const mqttConfig = require("../config/mqtt.config");
const swaggerConfig = require("../config/swagger.config");

const rateLimitMiddleware = require("./middleware/rate-limit.middleware");
const errorMiddleware = require("./middleware/error.middleware");
const appRouter = require("./router");
const webRoutes = require("../modules/web/web.routes");

const AppSocketServer = require("../infra/realtime/socketServer/server.socket");
const AppSocketClient = require("../infra/realtime/socketClient/client.socket");
const MqttPublisher = require("../infra/realtime/mqtt/publisher.mqtt");
const MqttSubscriber = require("../infra/realtime/mqtt/subscriber.mqtt");

const memoryUtil = require("../common/utils/memory.util");

class ApplicationServer {
  constructor() {
    this.port = process.env.PORT;
    this.app = appConfig.app;
    this.isTestEnv = process.env.NODE_APP_ENV === "test";

    if (process.env.HTTPS_ENABLED === "true") {
      this.server = https.createServer(appConfig.crt, this.app);
    } else {
      this.server = http.createServer(this.app);
    }

    this.appEvent = this.app.get("appEvent");
    this.io = null;

    if (!this.isTestEnv) {
      this.io = new socketConfig({ server: this.server }).io;
      this.socketClient = new socketClientConfig({
        url: process.env.SOCKET_CLIENT_URL,
        name: "app-client",
      }).client;
      this.mqttConnection = new mqttConfig({
        url: process.env.MQTT_URL,
        name: "app-broker",
      }).mqtt;
    } else {
      this.socketClient = null;
      this.mqttConnection = null;
    }

    this.initialized = false;
    this.initialize();
  }

  registerRoutes() {
    if (process.env.SWAGGER_ENABLED === "true") {
      this.app.use("/api-docs", swaggerConfig.getRouter()); 
    }
    this.app.use("/", webRoutes.getRoutes());
    this.app.use("/api/v1",
      rateLimitMiddleware.globalLimiter,
      rateLimitMiddleware.userLimiter,
      appRouter.getRoutesV1(),
    );
    this.app.use("/api/v2",
      rateLimitMiddleware.globalLimiter,
      rateLimitMiddleware.userLimiter,
      appRouter.getRoutesV2(),
    );
    this.app.use(errorMiddleware.globalErrorHandler.bind(errorMiddleware));
  }

  initializeSocketServer() {
    if (!this.io) return;

    new AppSocketServer({
      io: this.io,
      appEvent: this.appEvent,
    });
  }

  initializeSocketClient() {
    if (!this.socketClient) return;
    new AppSocketClient({
      socketClient: this.socketClient,
      appEvent: this.appEvent,
    });
  }

  initializeMqtt() {
    if (!this.mqttConnection) return;

    this.publisher = null;
    this.subscriber = null;

    this.mqttConnection.on("connect", () => {
      if (!this.publisher) {
        this.publisher = new MqttPublisher({
          conn: this.mqttConnection,
          appEvent: this.appEvent,
        });
      }

      if (!this.subscriber) {
        this.subscriber = new MqttSubscriber({
          conn: this.mqttConnection,
          appEvent: this.appEvent,
        });
      }
    });
  }

  initializeCronJobs() {
    // Enable when schedules are finalized:
    // testCron.run();
    // demoCron.run();
  }

  initialize() {
    if (this.initialized) {
      return;
    }

    this.registerRoutes();
    if (!this.isTestEnv) {
      this.initializeSocketServer();
      this.initializeSocketClient();
      this.initializeMqtt();
      this.initializeCronJobs();
    }
    this.initialized = true;
  }

  start() {
    this.initialize();
    this.server.listen(this.port, () => {
      const protocol = process.env.HTTPS_ENABLED === "true" ? "https" : "http";
      console.log(`Server listening on ${protocol}://localhost:${this.port}`);

      memoryUtil.logMemory("Server Started");
      if (process.env.ENABLE_MEMORY_MONITORING === "true") {
        memoryUtil.startMonitoring(10000);
      }
    });
  }
}

const applicationServer = new ApplicationServer();

module.exports = {
  applicationServer,
  app: applicationServer.app,
  server: applicationServer.server,
};
