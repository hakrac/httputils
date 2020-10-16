const Route = require('../route')
const {isolate} = require('../utils')

class WebSocketRouter {
    upgrade
    relativeUrl

    constructor() {
        this.stack = []
    }

    use(path, ...handlers) {
        if(typeof path === 'function' || path instanceof WebSocketRouter) {
            handlers = [path, ...handlers]
            path = ''
        }
        for(let handle of handlers) {
            this.stack.push({
                route: new Route(path, false),
                handle,
                errorHandler: handle instanceof WebSocketRouter || handle.length === 4
            })
        }
    }

    connection(path, handle) {
        if(typeof path === 'function' || path instanceof WebSocketRouter) {
            handle = path
            path = '*'
        }

        this.stack.push({
            route: new Route(path, true),
            handle
        })
    }

    async handle() {
        let err, req, socket, out
        if(arguments.length === 3) {
            [req, socket, out] = arguments
        } else if(arguments.length === 4) {
            [err, req, socket, out] = arguments 
        }

        out = isolate(out, req, 'relativeUrl', 'params')

        this.params = {}
        req.relativeUrl = this.relativeUrl || req.relativeUrl

        let idx = 0
        let next = async (err) => {
            while(idx < this.stack.length) {
                let {route, handle, errorHandler} = this.stack[idx++]
                
                if(!route) {
                    continue
                }

                let match = route.match(req.relativeUrl) 
                if(!match) {
                    continue
                }
                
                next = isolate(next, req, 'params')
                req.params = {...req.params, ...match.groups, ...this.params}

                let args = []

                if(handle instanceof WebSocketRouter) {
                    handle.relativeUrl = route.relative(req.relativeUrl)
                    handle.params = match.groups
                    handle.upgrade = this.upgrade
                    handle = handle.handle.bind(handle)
                }

                if(err) {
                    if(errorHandler) {
                        args = [err, req, socket, () => next(err)]
                    } else {
                        args = [err]
                        handle = next
                    }

                } else {
                    if(handle.length === 2) {
                        args = [handle]
                        handle = this.upgrade
                    }
                    else if(handle.length < 4) {
                        args = [req, socket, next]
                    } else {
                        args = []
                        handle = next
                    }
                }

                try {
                    return await handle(...args)
                } catch(err) {
                    return await next(err)
                }

            }
            await out(err)
        }
        await next(err)
    }
}

module.exports = WebSocketRouter