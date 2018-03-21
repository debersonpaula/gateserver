"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const url = require("url");
const enums = require("./Enums");
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
class TGateServer {
    /** Create TGateServer instance */
    constructor() {
        // create http server and attach main listener
        this._server = http.createServer(this._listener.bind(this));
        // start listeners and add listener module as first event
        this._listeners = [this._listener_module.bind(this)];
        this.Modules = {};
        this.OnAuthorization = (res) => { return true; };
        this.DataLimit = 1e6;
    }
    /** Start server and listen to port */
    listen(port, callback) {
        this._server.listen(port);
        // on error event
        this._server.on('error', (e) => {
            callback && callback(e);
        });
        // on listening event
        this._server.on('listening', () => {
            callback && callback();
        });
    }
    /** Close connection */
    close(cb) {
        this._server.close(cb);
    }
    /** Add Midleware to Listeners */
    use(handler) {
        this._listeners.unshift(handler);
    }
    /** Listener to createServer */
    _listener(req, res) {
        this._doListener(0, req, res);
    }
    /** Execute Listener */
    _doListener(id, req, res) {
        const length = this._listeners.length;
        const self = this;
        if (length) {
            let next;
            if (id + 1 < length) {
                next = function () {
                    self._doListener(id + 1, req, res);
                };
            }
            this._listeners[id](req, res, next);
        }
    }
    /** Listener to Module Authorization - Request */
    _listener_module(req, res) {
        if (req.url != '/favicon.ico') {
            // get parameters from headers
            const { modname } = req.headers;
            // get module
            const mod = this._getModule(modname);
            // data limit
            const { DataLimit } = this;
            // check if mod exists or throw an error
            if (mod) {
                const AuthRes = {
                    header: req.headers,
                    url: req.url,
                    method: req.method,
                    modname
                };
                if (this.OnAuthorization(AuthRes)) {
                    let body = '';
                    // fetch data from request
                    req.on('data', function (data) {
                        body += data;
                        // if the data length override the limit, kill connection
                        if (body.length > DataLimit)
                            req.connection.destroy();
                    });
                    // finalizes the fetch
                    req.on('end', function () {
                        request(mod.host + req.url, req.method || 'GET', req.headers, res, body);
                    });
                }
                else {
                    throwError(res, enums.ERROR_MODULE_FORBIDDEN);
                }
            }
            else {
                throwError(res, enums.ERROR_MODULE_NOT_EXIST);
            }
        }
    }
    /** Get Module by Name */
    _getModule(modName) {
        return this.Modules[modName];
    }
}
exports.TGateServer = TGateServer;
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
function throwError(res, errorCode) {
    const error = decodeError(errorCode);
    res.writeHead(error.status, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(error));
    res.end();
}
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
function decodeError(errorCode) {
    switch (errorCode) {
        case enums.ERROR_MODULE_NOT_EXIST:
            return { status: 404, error: enums.ERROR_MODULE_NOT_EXIST, message: 'This module does not exists.' };
        case enums.ERROR_MODULE_UNREACHABLE:
            return { status: 500, error: enums.ERROR_MODULE_UNREACHABLE, message: 'This module can not be reached.' };
        case enums.ERROR_MODULE_FORBIDDEN:
            return { status: 403, error: enums.ERROR_MODULE_FORBIDDEN, message: 'This module can not be accessed (forbidden).' };
    }
    return { status: 0, error: '', message: '' };
}
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
function request(urlstr, method, headers, response, post) {
    // extract url parts
    const { hostname, port, path } = url.parse(urlstr);
    // An object of options to indicate where to request to
    var reqOptions = { hostname, port, path, method, headers };
    // Set up the request
    var req = http.request(reqOptions, function (res) {
        // defining enconding
        res.setEncoding('utf8');
        // define header of response
        response.writeHead(200, { 'Content-Type': 'application/json' });
        // event on receiving data
        res.on('data', function (data) {
            response.write(data);
        });
        // event on receive finished
        res.on('end', () => {
            response.end();
        });
    });
    // Catch error
    req.on('error', (e) => {
        throwError(response, enums.ERROR_MODULE_UNREACHABLE);
    });
    // write data to request body
    if (post) {
        req.write(post);
    }
    ;
    // Finalizes the request
    req.end();
}
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/ 
