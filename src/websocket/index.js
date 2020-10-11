const url = require('url')


class WebSocketRouter {

    constructor() {
        this.stack = []
    }

    upgrade(path, ...handlers) {
        if(typeof path === 'function' || path instanceof WebSocketRouter) {
            handlers = [path, ...handlers]
            path = '/'
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

    ws(path, handle) {
        if(typeof path === 'function') {
            handle = path
            path = '/'
        }
        this.stack.push({
            route: new Route(path),
            handle
        })
    }

    handleUpgrade(req, socket, head, next) {
        let idx = 0
        let _next = () => {
            while(idx < this.stack.length) {
                let { route, handle } = this.stack[idx++]
                let urlInfo = url.parse(req.url)

                if(!route.match(urlInfo)) {
                    continue;
                }

                if(handle.length <= 4) {
                    handle(req, socket, head, _next)
                }
            }
            next()
        }
        _next()
    }

    handleConnection(req, ws) {
        let urlInfo = url.parse(req.url)
        for(let {route, handle} of this.stack) {
            if(route.match(urlInfo) && handle.length === 1) {
                handle(req, ws)
            }
        }
    }
}