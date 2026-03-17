require("dotenv").config();
const http = require("http");
const https = require("https");

// Config
const appConfig = require("./src/config/app.config");
const socketConfig = require("./src/config/socket.config");
const socketClientConfig = require("./src/config/socket-client.config");
const mqttConfig = require("./src/config/mqtt.config");
const rateLimitMiddleware = require("./src/middleware/ratelimit.middleware");

// Routes
const apiRoutes = require("./src/routes/api.routes");
const webRoutes = require("./src/routes/web.routes");

// Cron Jobs
const testCron = require("./src/cron/test.cron");
const demoCron = require("./src/cron/demo.cron");

// Events and Sockets, Client
const testSocket = require("./src/socket/server/test.socket");
const testSocketClient = require("./src/socket/client/test.socketclient");

// MQTT
const publishMqtt = require("./src/mqtt/publish.mqtt");
const subscribeMqtt = require("./src/mqtt/subscribe.mqtt");

// Utils
const memoryUtils = require("./src/utils/memory.utils");

class main {
    constructor() {
        this.PORT = process.env.PORT;
        this.app = appConfig.app;

        if (process.env.HTTPS_ENABLED === "true") {
            this.server = https.createServer(appConfig.crt, this.app);   
        } else {
            this.server = http.createServer(this.app);
        }

        this.appEvent = this.app.get("appEvent");
        this.io = new socketConfig({server:this.server}).io;
        this.socketClient = new socketClientConfig({url: process.env.SOCKET_CLIENT_URL,name: "demo"}).client;
        this.mqttConnection = new mqttConfig({url: process.env.MQTT_URL, name: "demo"}).mqtt;
    }

    Routes() {
        this.app.use("/", webRoutes.allRoutes());
        this.app.use(/^\/api\/(v1|v2)/, rateLimitMiddleware.defaultLimiter, apiRoutes.getRoutes());
        this.app.use("/", (req, res) => res.status(404).json({ success: false, message: "404 page not found" }));
    }

    Socket() {
        this.io.on("connection", (socket) => {
            new testSocket({
                socket,
                appEvent: this.appEvent
            });
        });
    }

    SocketClient() {
        new testSocketClient({
            socketClient: this.socketClient,
            appEvent: this.appEvent
        });
    }

    Mqtt() {
        this.mqttConnection.on("connect", () => {
            new publishMqtt({ conn: this.mqttConnection, appEvent: this.appEvent });
            new subscribeMqtt({ conn: this.mqttConnection, appEvent: this.appEvent });
        });
    }

    Cron() {
        // testCron.Run();
        // demoCron.Run();
    }

    Initialize() {
        this.Routes();
        this.Socket();
        this.SocketClient();
        this.Cron();
        this.Mqtt();
    }

    Start() {
        this.Initialize();
        this.server.listen(this.PORT, () => {
            const protocol = process.env.HTTPS_ENABLED === "true" ? "https" : "http";
            console.log(`Server listening on ${protocol}://localhost:${this.PORT}`);
            
            // Start monitoring
            memoryUtils.logMemory("Server Started");
            if (process.env.ENABLE_MEMORY_MONITORING === "true") {
                memoryUtils.startMonitoring(10000);
            }
        });
    }
}

const main_app = new main();

if (process.env.NODE_APP_ENV !== "test") {
    main_app.Start();
}

// Run for jest Testing
module.exports = { app: main_app.app, server: main_app.server };