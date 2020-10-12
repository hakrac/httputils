const {Route} = require('../route')

class WebSocketRouter {

    constructor() {
        this.stack = []
    }

    use(path, ...handlers) {
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

    async handleUpgrade(req, socket, head, after) {
        let idx = 0
        let _next = async () => {
            while(idx < this.stack.length) {
                let { route, handle } = this.stack[idx++]
                let match = route.match(req.relativeUrl)

                if(handle.length === 2 || !match) {
                    continue
                }
                
                let originalParams = req.params
                req.params = {...match.groups, ...req.params}

                if(handle instanceof WebSocketRouter) {
                    req.parentUrl = req.relativeUrl
                    req.relativeUrl = route.relative(req.relativeUrl)
                    await handle.handleUpgrade(req, socket, head, _next)
                } else if(handle.length === 4) {
                    await handle(req, socket, head, _next)
                }

                req.params = originalParams
                return
            }
            // we are through this upgrade stack
            req.relativeUrl = req.parentUrl || req.relativeUrl
            await after()
        }
        await _next()
    }

    async handleConnection(ws, req) {
        for(let {route, handle} of this.stack) {
            let match = route.match(req.relativeUrl)
            if(match) {
                req.params = {...match.groups, ...req.params}
                if(handle instanceof WebSocketRouter) {
                    req.parentUrl = req.relativeUrl
                    req.relativeUrl = route.relative(req.relativeUrl)
                    await handle.handleConnection(ws, req)
                } else if(handle.length === 2 && route.matchFull(req.relativeUrl)) {
                    await handle(ws, req)
                }
            }
        }

        req.relativeUrl = req.parentUrl || req.relativeUrl
    }
}

module.exports = {
    WebSocketRouter
}