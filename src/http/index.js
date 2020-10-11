const http = require('http')
const url = require('url')

class HttpRouter {

    constructor() {
        this.stack = []
    }

    use(path, ...handlers) {
        if(typeof path === 'function' || path instanceof HttpRouter) {
            handlers = [path, ...handlers]
            path = '/'
        }
        for(let handle of handlers) {
            this.stack.push({
                route: new Route(path),
                handle
            })
        }
    }

    handle() {
        let err, req, res, next
        if(arguments.length < 4) {
            [req, res, next] = arguments
        } else if (arguments.length === 4) {
            [err, req, res, next] = arguments
        }

        let idx = 0
        let _next = (err) => {
            while(idx < this.stack.length) {
                let {route, handle} = this.stack[idx++]
                let urlInfo = url.parse(req.url)

                if(!route.match(urlInfo)) {
                    continue
                }

                if(err) {
                    if(typeof handle.handle === 'function') {
                        handle.handle(err, req, res, _next)
                    } else if(handle.length === 4) {
                        handle(err, req, res, _next)
                    }
                } else {
                    handle(req, res, _next)
                }
            }
            next()
        }
        _next(err)
    }

}

for(let method of http.METHODS) {
    HttpRouter.prototype[method] = (path, handle) => {
        this.stack.push({
            route: new Route(path),
            handle
        })
    }
}