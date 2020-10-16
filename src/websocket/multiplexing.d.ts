/// <reference types="node"/>

import { EventEmitter } from 'events'
import ApplicationRequest from '../request'
import ApplicationResponse from '../response'

type middleware = (req: ApplicationRequest, res: ApplicationResponse, next) => void 

declare class MultiplexingRouter extends EventEmitter {
    relativeUrl: string
    params: string

    constructor(
        multiplexingKey?: string
    )

    broadcast(ws, message: any): void
    async handle(req, res, next): void
    use(...handlers: middleware[] | MultiplexingRouter[]): void
    upgrade(fn: (ws, req) => void): void
    ws(ws, req): void
}


export = MultiplexingRouter