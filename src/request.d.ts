/// <reference types="node"/>

import http from "http";

declare class ApplicationRequest extends http.IncomingMessage {
    query: string
    path: string
    hostname: string
    xhr: boolean
    cookies: string[]
    secure: boolean

    accepts(mimeType: string | string[]): boolean
}

export = ApplicationRequest
