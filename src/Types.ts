import * as http from 'http';

export interface TModule { host: string }
export type TModules = { [key: string] : TModule };

export interface TAuthResponse {
  header: http.IncomingHttpHeaders;
  modname: string | string[] | undefined;
  url?: string;
  method?: string;
}
export type TAuthHandler = (res: TAuthResponse) => boolean;
export type TListenerHandler = (request: http.IncomingMessage, response: http.ServerResponse, next?: Function) => void;

export interface TError {
  status: number;
  error: string;
  message: string;
}