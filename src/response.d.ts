/// <reference types="node"/>

import http from "http";

declare class ApplicationResponse extends http.ServerResponse {
    send(body: string | Buffer | object): void
}

export module "response" {
    ApplicationResponse
}
