import ApplicationRequest from "../request";
import ApplicationResponse from "../response";

type middleware = (req, res, next) => void
type handler = (req, res) => void

declare class WebSocketRouter {
    relativeUrl: string
    params: string
        
    constructor()
    
    broadcast(ws, message: any): void
    handle(err: any, req: ApplicationRequest, res: ApplicationResponse, next: (err?) => void): void
    handle(req: ApplicationRequest, res: ApplicationResponse, next: (err?) => void): void
    use(path: string, ...handlers: middleware[]): void
    use(...handlers: middleware[]): void
    connection(path: string, ...handlers): void
    upgrade(fn: (ws: WebSocket, req: ApplicationRequest) => void): void
}

export = WebSocketRouter