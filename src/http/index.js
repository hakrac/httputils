const http = require('http')

const {Route} = require('../route')

const METHODS = [
    'GET',
    'POST',
    'DELETE',
    'PUT',
    'OPTIONS',
    'HEAD'
]

class HTTPRouter {

    constructor() {
        this.stack = []
    }

    use(path, ...handlers) {
        if(typeof path === 'function' || path instanceof HTTPRouter) {
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

                if(!route.match(req.relativeUrl)) {
                    continue
                }
                
                if(err) {
                    if(typeof handle.handle === 'function') {
                        req.relativeUrl = route.relative(req.relativeUrl)
                        handle.handle(err, req, res, _next)
                    } else if(handle.length === 4) {
                        handle(err, req, res, _next)
                    }
                } else {
                    if(typeof handle.handle === 'function') {
                        req.relativeUrl = route.relative(req.relativeUrl)
                        handle.handle(req, res, _next)
                    } else if(handle.length === 3) {
                        handle(req, res, _next)
                    } else if (handle.length === 2 && route.matchFull(req.relativeUrl)) {
                        handle(req, res)
                    }
                }
            }
            next()
        }
        _next(err)
    }

}

for(let method of METHODS) {
    HTTPRouter.prototype[method.toLowerCase()] = function (path, handle) {
        this.stack.push({
            route: new Route(path, method),
            handle,
        })
    }
}

module.exports = {
    HTTPRouter,
    METHODS
}