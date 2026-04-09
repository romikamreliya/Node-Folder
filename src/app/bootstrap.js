const { applicationServer, app, server } = require("./server");

function startApp() {
  applicationServer.start();
}

module.exports = {
  startApp,
  app,
  server,
};
