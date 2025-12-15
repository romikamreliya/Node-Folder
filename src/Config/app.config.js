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
    }

    middlewares() {
        this.app.use(helmet());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use('/public',express.static('public'));
        this.app.use(cors())
        this.app.set('views',path.join(__dirname,"../Views"));
        this.app.set('view engine', 'ejs')
        this.app.set('appEvent', require("./event.config"))
        // this.app.use((req,res,next)=>LanguageMiddleware.use(req,res,next));

        console.log('App Config Successfully');
    }
}

module.exports = AppConfig;