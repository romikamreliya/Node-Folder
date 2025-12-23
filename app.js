require("dotenv").config();
const http = require("http");
const https = require("https");

// Config
const appConfig = require("./src/Config/app.config");
const SocketConfig = require("./src/Config/socket.config");
const SocketClientConfig = require("./src/Config/socket-client.config");
const MQTTConfig = require("./src/Config/mqtt.config");
const RateLimitMiddleware = require("./src/Middleware/ratelimit.middleware");

// Routes
const apiRoutes = require("./src/Routes/api.routes");
const WebRoutes = require("./src/Routes/web.routes");

// Cron Jobs
const TestCron = require("./src/Cron/test.cron");
const DemoCron = require("./src/Cron/demo.cron");

// Events and Sockets, Client
const TestSocket = require("./src/Socket/Server/test.socket");
const TestSocketClient = require("./src/Socket/Client/test.socketclient");

// MQTT
const PublishMqtt = require("./src/Mqtt/publish.mqtt");
const SubscribeMqtt = require("./src/Mqtt/subscribe.mqtt");

class Main {
    constructor() {
        this.PORT = process.env.PORT;
        this.app = appConfig.app;

        if (process.env.HTTPS_ENABLED == "true") {
            this.server = https.createServer(appConfig.crt, this.app);   
        } else {
            this.server = http.createServer(this.app);
        }

        this.appEvent = this.app.get("appEvent");
        this.io = new SocketConfig(this.server).io;
        this.socketClient = new SocketClientConfig({url: process.env.SOCKET_CLIENT_URL,name: "demo"}).client;
        this.mqttConnection = new MQTTConfig({url: process.env.MQTT_URL, name: "demo"}).mqtt;
    }

    Routes() {
        this.app.use("/", WebRoutes.allRoutes());
        this.app.use( /^\/api\/(v1|v2)/, RateLimitMiddleware.defaultLimiter, apiRoutes.getRoutes());
        this.app.use("/", (req, res) => res.send("404 page not found"));
    };

    Socket() {
        this.io.on("connection",(socket) => 
            new TestSocket({ 
                io: this.io, 
                socket, 
                appEvent: this.appEvent 
            })
        );
    };

    SocketClient() {
        new TestSocketClient({
            socketClient: this.socketClient,
            appEvent: this.appEvent,
        });
    };

    Mqtt() {
        this.mqttConnection.on("connect", () => {
            console.log("✅ Connected to broker:", process.env.MQTT_URL);
            new PublishMqtt({ conn: this.mqttConnection, appEvent: this.appEvent });
            new SubscribeMqtt({ conn: this.mqttConnection, appEvent: this.appEvent });
        });
    };

    Cron() {
        // TestCron.Run();
        // DemoCron.Run();
    };

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
            console.log(`Example app listening on port ${this.PORT} - ${process.env.HTTPS_ENABLED == "true"? "https" : "http"}`);
        });
    };
}

const main = new Main();

if (process.env.NODE_APP_ENV != "test") {
    main.Start();
}

// Run for jest Testing
module.exports = { app: main.app, server: main.server };