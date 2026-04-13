const express = require("express");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

class SwaggerConfig {
  constructor() {
    this.options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: process.env.NAME || 'API',
          version: '1.0.0',
          description: 'API Documentation'
        },
        servers: [
          {
            url: 'http://localhost:3008',
            description: 'Development'
          }
        ],
        components: {
          securitySchemes: {
            BearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT"
            }
          }
        }
      }
    };
  }

  getOptions(version) {

    version = version || 'v1';
    this.options.apis = [`./src/swagger/${version}/**/*.routes.js`];

    return this.options;
  }

  getSpecs() {
    const router = express.Router();
    router.use("/v1", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(this.getOptions("v1"))));
    return router;
  }
}

module.exports = new SwaggerConfig();