declare class HTTPRouter {
    relativeUrl: string
    constructor()

    param(param: string, ...handlers): void
    handle(err, req, res, next): void
    handle(req, res, next): void
    use(path: string, ...handlers): void
    use(...handlers): void
    get(path: string, handler): void
    get(handler): void
    post(path: string, handler): void
    post(handler): void
    head(path: string, handler): void
    head(handler): void
    put(path: string, handler): void
    put(handler): void
    delete(path: string, handler): void
    delete(handler): void
    all(path: string, handler): void
    all(handler): void
}

export = HTTPRouter