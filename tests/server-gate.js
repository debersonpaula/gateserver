const serverHandler = new Promise((resolve, reject) => {
  // require gateserver
  const {TGateServer} = require('../index');
  // create server instance
  const server = new TGateServer;
  // load module definition
  server.Modules = {
    "mock-test": {
      "host": "http://localhost:3000"
    }
  };
  // authorization callback
  // to make request, should return true
  // to block request, should return false
  server.OnAuthorization = function(req) {
    // console.log('OnAuthorization', req);
    return true;
  }
  // start server on port 8080
  server.listen(8080, (err) => {
    if (err) {
      // console.log('Error : ', err);
      reject(err);
    } else {
      // console.log('Gateway Server running at 8080.');
      resolve(server);
    }
  });
});

module.exports = serverHandler;