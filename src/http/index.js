const http = require('http')
const utils = require('../utils')

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

    async handle() {
        let err, req, res, after
        if(arguments.length < 4) {
            [req, res, after] = arguments
        } else if (arguments.length === 4) {
            [err, req, res, after] = arguments
        }

        let idx = 0
        let _next = async (err) => {
            while(idx < this.stack.length) {
                let {route, handle} = this.stack[idx++]

                if(!route.match(req.relativeUrl)) {
                    continue
                }
                
                if(err) {
                    if(typeof handle.handle === 'function') {
                        let originalUrl = req.relativeUrl
                        req.relativeUrl = route.relative(req.relativeUrl)
                        await handle.handle(err, req, res, _next)
                        req.relativeUrl = originalUrl
                    } else if(handle.length === 4) {
                        await handle(err, req, res, _next)
                    }
                } else {
                    if(typeof handle.handle === 'function') {
                        let originalUrl = req.relativeUrl
                        req.relativeUrl = route.relative(req.relativeUrl)
                        await handle.handle(req, res, _next)
                        req.relativeUrl = originalUrl
                    } else if(handle.length === 3) {
                        await handle(req, res, _next)
                    } else if (handle.length === 2 && route.matchFull(req.relativeUrl)) {
                        await handle(req, res)
                    }
                }
            }
        }
        await _next(err)
        await after(err)
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