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
            console.log('idx', idx)
            while(idx < this.stack.length) {
                let { route, handle } = this.stack[idx++]
                let match = route.match(req.relativeUrl)

                if(handle.length === 2 || !match) {
                    continue
                }
                
                let originalParams = req.params
                req.params = {...match.groups, ...req.params}

                if(handle instanceof WebSocketRouter) {
                    let originalUrl = req.relativeUrl
                    req.relativeUrl = route.relative(req.relativeUrl)
                    console.log('1')
                    await handle.handleUpgrade(req, socket, head, _next)
                    console.log('5')
                    req.relativeUrl = originalUrl
                } else if(handle.length === 4) {
                    console.log('2')
                    await handle(req, socket, head, _next)
                    console.log('4')
                }

                req.params = originalParams
                return
            }
            // we are through this upgrade stack
            await after()
        }
        await _next()
    }

    async handleConnection(ws, req) {
        for(let {route, handle} of this.stack) {
            console.log('3')
            console.log(route, req.relativeUrl)
            if(route.match(req.relativeUrl)) {
                if(handle instanceof WebSocketRouter) {
                    let originalUrl = req.relativeUrl
                    req.relativeUrl = route.relative(req.relativeUrl)
                    await handle.handleConnection(ws, req)
                    req.relativeUrl = originalUrl
                } else if(handle.length === 2) {
                    await handle(ws, req)
                }
            }
        }
    }
}

module.exports = {
    WebSocketRouter
}