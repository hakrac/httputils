const {Route} = require('../route')

class WebSocketRouter {

    constructor() {
        this.stack = []
    }

    upgrade(path, ...handlers) {
        if(typeof path === 'function' || path instanceof WebSocketRouter) {
            handlers = [path, ...handlers]
            path = '*'
        }
        for(let handle of handlers) {
            if(handle.length >= 3) {
                this.stack.push({
                    route: new Route(path),
                    handle
                })
            }
        }
    }

    connection(path, handle) {
        if(typeof path === 'function' || path instanceof WebSocketRouter) {
            handle = path
            path = '*'
        }

        this.stack.push({
            route: new Route(path),
            handle
        })
    }

    handleUpgrade(req, socket, head, after) {
        let idx = 0
        let _next = () => {
            while(idx < this.stack.length) {
                let { route, handle } = this.stack[idx++]

                if(!route.match(req.relativeUrl)) {
                    continue;
                }

                if(handle instanceof WebSocketRouter) {
                    let originalUrl = req.relativeUrl
                    req.relativeUrl = route.relative(req.relativeUrl)
                    handle.handleUpgrade(req, socket, head, _next)
                    req.relativeUrl = originalUrl
                }
                if(handle.length === 4) {
                    handle(req, socket, head, _next)
                }
            }
        }
        _next()
        after()
    }

    handleConnection(ws, req) {
        for(let {route, handle} of this.stack) {
            if(route.match(req.relativeUrl)) {
                if(handle instanceof WebSocketRouter) {
                    let originalUrl = req.relativeUrl
                    req.relativeUrl = route.relative(req.relativeUrl)
                    handle.handleConnection(ws, req)
                    req.relativeUrl = originalUrl
                } else if(handle.length === 2) {
                    handle(ws, req)
                }
            }
        }
    }
}

module.exports = {
    WebSocketRouter
}