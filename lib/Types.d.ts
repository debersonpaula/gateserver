/// <reference types="node" />
import * as http from 'http';
export interface TModule {
    host: string;
}
export declare type TModules = {
    [key: string]: TModule;
};
export interface TAuthResponse {
    header: http.IncomingHttpHeaders;
    modname: string | string[] | undefined;
    url?: string;
    method?: string;
}
export declare type TAuthHandler = (res: TAuthResponse) => boolean;
export declare type TListenerHandler = (request: http.IncomingMessage, response: http.ServerResponse, next?: Function) => void;
export interface TError {
    status: number;
    error: string;
    message: string;
}
