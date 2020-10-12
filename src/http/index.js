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
        let next = async (err) => {
            while(idx < this.stack.length) {
                let {route, handle} = this.stack[idx++]
                let match = route.match(req.relativeUrl) 
                if(!match) {
                    continue
                }

                let originalParams = req.params
                req.params = {...match.groups, ...req.params}
                
                if(err) {
                    if(handle instanceof HTTPRouter) {
                        req.parentUrl = req.relativeUrl
                        req.relativeUrl = route.relative(req.relativeUrl)
                        await handle.handle(err, req, res, next)
                    } else if(handle.length === 4) {
                        await handle(err, req, res, next)
                    }
                } else {
                    if(handle instanceof HTTPRouter) {
                        req.parentUrl = req.relativeUrl
                        req.relativeUrl = route.relative(req.relativeUrl)
                        await handle.handle(req, res, next)
                    } else if(handle.length === 3) {
                        await handle(req, res, next)
                    } else if (handle.length === 2 && route.matchFull(req.relativeUrl)) {
                        await handle(req, res)
                    }
                }
                req.params = originalParams
                return
            }
            // no tail found
            req.relativeUrl = req.parentUrl || req.relativeUrl
            await after(err)
        }
        await next(err)
    }

}

for(let method of METHODS) {
    HTTPRouter.prototype[method.toLowerCase()] = function (path, handle) {
        if(typeof path === 'function') {
            handle = path
            path = '*'
        }

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