const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const ejs = require('ejs');
const helmet = require("helmet");

class AppConfig {
    constructor() {
        this.app = express();
        this.middlewares();
        this.allowedOrigins = (process.env.ALLOWED_ORIGINS).split(',').map(origin => origin.trim());
    }

    corsOptions = {
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['X-Request-ID'],
        maxAge: 86400, // 24 hours
        optionsSuccessStatus: 200
    }

    middlewares() {
        this.app.use(helmet());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use('/public',express.static('public'));
        this.app.use(cors(this.corsOptions));
        this.app.set('views',path.join(__dirname,"../Views"));
        this.app.set('view engine', 'ejs')
        this.app.set('appEvent', require("./event.config"))
        // this.app.use((req,res,next)=>LanguageMiddleware.use(req,res,next));

        console.log('App Config Successfully');
    }
}

module.exports = new AppConfig();