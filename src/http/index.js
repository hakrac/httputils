const {Route} = require('../route')
const {isolate} = require('../utils')

const METHODS = [
    'ALL',
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

    param(param, handle) {
        if(typeof param === 'string' && typeof handle === 'function') {
            this.stack.push({
                param,
                errorHandler: false,
                handler
            })
        }
    }

    use(path, ...handlers) {
        if(typeof path === 'function' || path instanceof HTTPRouter) {
            handlers = [path, ...handlers]
            path = '/'
        }
        for(let handle of handlers) {
            if(typeof handle === 'function' || handle instanceof HTTPRouter) {

                this.stack.push({
                    route: new Route(path, false),
                    handle,
                    errorHandler: handle instanceof HTTPRouter || handle.length === 4
                })
            }
        }
    }

    async handle() {
        let err, req, res, out
        if(arguments.length === 3) {
            [req, res, out] = arguments
        } else if (arguments.length === 4) {
            [err, req, res, out] = arguments
        }

        out = isolate(out, req, 'relativeUrl', 'params')

        this.params = {}
        req.relativeUrl = this.relativeUrl || req.relativeUrl

        let idx = 0
        let next = async (err) => {
            while(idx < this.stack.length) {
                let {route, handle, errorHandler, method} = this.stack[idx++]
                
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

                if(handle instanceof HTTPRouter) {
                    handle.relativeUrl = route.relative(req.relativeUrl)
                    handle.params = match.groups
                    handle = handle.handle.bind(handle)
                }

                if(err) {
                    if(errorHandler) {
                        args = [err, req, res, () => next(err)]
                    } else {
                        args = [err]
                        handle = next
                    }
                } else {
                    if((method && method !== req.method.toLowerCase()) ||
                        (handle.length === 4)) {
                        args = []
                        handle = next
                    } else {
                        args = [req, res, next]
                    }
                }

                try {
                    return await handle(...args)
                } catch(err) {
                    await next(err)
                }
            }
            await out(err)
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
            method,
            route: new Route(path, true),
            handle,
        })
    }
}

module.exports = {
    HTTPRouter,
    isolate,
    METHODS
}