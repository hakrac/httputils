/// <reference types="node"/>

import http from "http";

declare class ApplicationRequest extends http.IncomingMessage {
    send(body: string | Buffer | object): void
}

export = ApplicationRequest
