require('dotenv').config();
const http = require('http');
const helmet = require('helmet');
const express = require("express");
const bodyParser = require('body-parser');
const EventEmitter = require('events');
const {Server} = require('socket.io');
const cors = require('cors');
const ejs = require('ejs');
const path = require('path');
const { rateLimit } = require('express-rate-limit');

// Routes
const APIRoutes = require("./src/Routes/api.route");
const WebRoutes = require("./src/Routes/web.route");

// Cron Jobs
const TestCron = require("./src/Cron/test.cron");
const DemoCron = require("./src/Cron/demo.cron");

// Events and Sockets
const TestEvent = require("./src/Events/test.event");
const TestSocket = require("./src/Socket/test.socket");

class Main {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.PORT = process.env.PORT;
    this.eventEmitter = new EventEmitter();
    this.io = new Server(this.server);
    this.Start();
  }

  Config = () => {
    this.app.use(helmet());
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(bodyParser.json())
    this.app.use(express.static('public'))
    this.app.use(cors())
    this.app.set('eventEmitter', this.eventEmitter)
    this.app.set('views',path.join(__dirname,"./src/Views"));
    this.app.set('view engine', 'ejs')

    // set limit for API requests
    this.app.use(rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minutes
      limit: 10,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
    }))
  }

  Routes = () => {
    this.app.use("/", WebRoutes.allRoutes());
    this.app.use("/api/v1", APIRoutes.allRoutes());
    this.app.use("/", (req, res) => res.send("404 page not found"));
  };

  Cron = () => {
    // TestCron.Run();
    // DemoCron.Run();
  }

  Socket = () => {
    this.io.of('/test').on('connection',(socket) => new TestSocket(socket,this.io));
  }

  Events = () => {
    new TestEvent(this.eventEmitter);
  }

  Start = () => {
    this.Config();
    this.Routes();
    this.Socket();
    this.Events();
    this.Cron();

    this.server.listen(this.PORT, () => {
      console.log(`Example app listening on port ${this.PORT}`);
    });
  };
}
new Main();
