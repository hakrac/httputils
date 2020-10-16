/// <reference types="node"/>

import { EventEmitter } from 'events'

declare class MultiplexingRouter extends EventEmitter {
    relativeUrl: string
    params: string

    constructor(
        multiplexingKey: string
    )

    broadcast(ws, message: any): void
    async handle(req, res, next): void
    use(...handlers): void
    upgrade(fn: (ws, req) => void): void
    ws(ws, req): void
}


export = MultiplexingRouter