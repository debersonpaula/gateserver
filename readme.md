# Gateway Server

Simple HTTP server that works as gateway between application and API.

[![NPM](https://nodei.co/npm/gateserver.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/gateserver)

## Concept

The GateServer concept is based on the principle of protecting direct access to your APIs and providing a unique system of access and authentication, preventing each API from having its own authentication routine.
![NPM Version][img-concept]

## Install

``` bash
npm install gateserver --save
```

## Usage

To start a server on port 8080:

```js
// require gateserver
const {TGateServer} = require('gateserver');

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
	console.log('OnAuthorization', req);
	return true;
}

// start server on port 8080
server.listen(8080);
```

## Test

To test the example above, should make a request with `modname: mock-test` in the header and URL = `localhost:8080`.
For sure, the target host `http://localhost:3000` should be running. If not, the GateServer will return an error to the requester.

[img-concept]: https://github.com/debersonpaula/gateserver/raw/master/docs/concept.png


## License

  [MIT](LICENSE)