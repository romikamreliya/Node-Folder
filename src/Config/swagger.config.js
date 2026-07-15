const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

class SwaggerConfig {
  constructor() {
    this.versions = ["v1", "v2"];

    this.baseDefinition = {
      openapi: "3.0.0",
      info: {
        title: process.env.NAME || "API",
        version: "1.0.0",
        description: "API Documentation"
      },
      servers: [
        {
          url: "http://localhost:3008",
          description: "Development Server"
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
    };
  }

  getOptions(version = "v1") {
    return {
      definition: {
        ...this.baseDefinition,
        info: {
          ...this.baseDefinition.info,
          version: version.toUpperCase(),
          description: `${version.toUpperCase()} API Documentation`
        }
      },
      apis: [`./src/swagger/${version}/**/*.routes.js`]
    };
  }

  getSpecs(version = "v1") {
    return swaggerJsdoc(this.getOptions(version));
  }

  getRouter() {
    const router = express.Router();

    // JSON Docs
    this.versions.forEach(version => {
      router.get(`/version/${version}.json`, (req, res) => {
        res.json(this.getSpecs(version));
      });
    });

    // Swagger UI with version dropdown
    router.use(
      "/",
      swaggerUi.serve,
      swaggerUi.setup(null, {
        explorer: true,
        swaggerOptions: {
          urls: this.versions.map(version => ({
            url: `/api-docs/version/${version}.json`,
            name: `${version.toUpperCase()} API`
          }))
        }
      })
    );

    return router;
  }
}

module.exports = new SwaggerConfig();