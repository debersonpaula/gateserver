import { TModules, TAuthHandler, TListenerHandler } from './Types';
export declare class TGateServer {
    private _server;
    private _listeners;
    Modules: TModules;
    OnAuthorization: TAuthHandler;
    DataLimit: number;
    /** Create TGateServer instance */
    constructor();
    /** Start server and listen to port */
    listen(port: number, callback?: Function): void;
    /** Close connection */
    close(cb?: any): void;
    /** Add Midleware to Listeners */
    use(handler: TListenerHandler): void;
    /** Listener to createServer */
    private _listener(req, res);
    /** Execute Listener */
    private _doListener(id, req, res);
    /** Listener to Module Authorization - Request */
    private _listener_module(req, res);
    /** Get Module by Name */
    private _getModule(modName);
}
