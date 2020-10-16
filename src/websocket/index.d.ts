import ApplicationRequest from "../request";
import ApplicationResponse from "../response";
import MultiplexingRouter from "./multiplexing";

type middleware = (req: ApplicationRequest, res: ApplicationResponse, next) => void
type handler = (req: ApplicationRequest, res: ApplicationResponse) => void

declare class WebSocketRouter {
    relativeUrl: string
    params: string
        
    constructor()
    
    broadcast(ws, message: any): void
    handle(err: any, req: ApplicationRequest, res: ApplicationResponse, next: (err?) => void): void
    handle(req: ApplicationRequest, res: ApplicationResponse, next: (err?) => void): void
    use(path: string, ...handlers: middleware[] | WebSocketRouter[] | MultiplexingRouter[]): void
    use(...handlers: middleware[] | WebSocketRouter[] | MultiplexingRouter[]): void
    connection(path: string, ...handlers): void
    upgrade(fn: (ws: WebSocket, req: ApplicationRequest) => void): void
}

export = WebSocketRouter