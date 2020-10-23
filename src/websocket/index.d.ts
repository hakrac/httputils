import ApplicationRequest from "../request";
import ApplicationResponse from "../response";
import MultiplexingRouter from "./multiplexing";

type handler = ((req: ApplicationRequest, res: ApplicationResponse, next: (err?) => void) => void) | WebSocketRouter | MultiplexingRouter

declare class WebSocketRouter {
    relativeUrl: string
    params: string
        
    constructor()
    
    broadcast(ws, message: any): void
    handle(err: any, req: ApplicationRequest, res: ApplicationResponse, next: (err?) => void): void
    handle(req: ApplicationRequest, res: ApplicationResponse, next: (err?) => void): void
    use(path: string, ...handlers: handler[]): void
    use(...handlers: handler[]): void
    connection(path: string, ...handlers): void
    upgrade(fn: (ws: WebSocket, req: ApplicationRequest) => void): void
}

export = WebSocketRouter