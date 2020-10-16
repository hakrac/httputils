/// <reference types="node" />

import { http } from 'http'
import HTTPRouter from './http'
import WebSocketRouter from './websocket'
import MultiplexingRouter from './websocket/multiplexing'

declare class Application extends http.Server {
    ws: WebSocketRouter | MultiplexingRouter
    http: HTTPRouter

    constructor(
        Request: IncomingMessage,
        Response: ServerResponse,
        wsMultiplexing?: string, 
        wsMultiplexingKey?: string, 
        webSocketOptions?: any
    )

    broadcast(
        client: any,
        message: string | object | Buffer
    )

    listen(...args: any[])
} 


export = Application