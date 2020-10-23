/// <reference types="node"/>

import http from "http";
import cookie from "cookie"

declare class ApplicationResponse extends http.ServerResponse {
    set(key: string, value: string): ApplicationResponse
    get(key: string): string | undefined
    redirect(location: string): ApplicationResponse
    status(statusCode: number): ApplicationResponse
    json(object: typeof object): void
    cookie(key: string, value: string, options: cookie.CookieSerializeOptions): ApplicationResponse
    
    send(body: string | Buffer | object): void
}

export = ApplicationResponse
