const { startApp, app, server } = require("./src/app/bootstrap");

if (process.env.NODE_APP_ENV !== "test") {
  startApp();
}

module.exports = { app, server };
