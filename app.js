const { applicationServer, app, server } = require("./src/app/server");

if (process.env.NODE_APP_ENV !== "test") {
  applicationServer.start();
}

module.exports = { app, server };
