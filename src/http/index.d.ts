import ApplicationRequest from "../request"
import ApplicationResponse from "../response"

declare type handler = ((req: ApplicationRequest, res: ApplicationResponse, next: () => void) => any) | HTTPRouter

declare class HTTPRouter {
    relativeUrl: string
    constructor()

    param(param: string, ...handlers): void
    handle(err, req, res, next): void
    handle(req, res, next): void
    use(path: string, ...handlers: handler[]): void
    use(...handlers: handler[]): void
    get(path: string, ...handlers: handler[]): void
    get(...handlers: handler[]): void
    post(path: string, ...handlers: handler[]): void
    post(...handlers: handler[]): void
    head(path: string, ...handlers: handler[]): void
    head(...handler: handler[]): void
    put(path: string, ...handlers: handler[]): void
    put(...handlers: handler[]): void
    delete(path: string, ...handlers: handler[]): void
    delete(...handlers: handler[]): void
    all(path: string, ...handler: handler[]): void
    all(...handler: handler[]): void
}

export = HTTPRouter