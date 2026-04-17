const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const fs = require("fs");

const RequestLoggerMiddleware = require("../app/middleware/request-logger.middleware");
const Constants = require("../common/utils/constants");

/**
 * Express application configuration
 */
class AppConfig {
  constructor() {
    this.app = express();
    this.allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((origin) => origin.trim());
    this.middlewares();
  }

  crt = {
    key: fs.readFileSync("./crt/localhost.key", "utf8"),
    cert: fs.readFileSync("./crt/localhost.crt", "utf8"),
  };

  helmetConfig = {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
      },
    },
    hsts: {
      maxAge: Constants.http.hstsMaxAge,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true,
    noSniff: true,
  };

  corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || this.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["X-Request-ID"],
    maxAge: Constants.http.corsMaxAge,
    optionsSuccessStatus: Constants.http.corsOptionsStatus,
  };

  middlewares() {
    this.app.use(helmet(this.helmetConfig));
    this.app.use(express.urlencoded({ extended: false, limit: Constants.http.bodyLimitUrlEncoded }));
    this.app.use(express.json({ limit: Constants.http.bodyLimitJson }));
    this.app.use("/public", express.static("public"));
    this.app.use(cors(this.corsOptions));
    this.app.set("views", path.join(__dirname, "../views"));
    this.app.set("view engine", "ejs");
    this.app.set("appEvent", require("./event.config"));
    // this.app.use((req,res,next)=>LanguageMiddleware.use(req,res,next)); // for multi language support

    if (process.env.REQUEST_LOGGER_ENABLED === "true") {
      this.app.use(RequestLoggerMiddleware.skip(["/health", "/public"]));
    }

    console.log("✓ App Config Initialized Successfully");
  }
}

module.exports = new AppConfig();
