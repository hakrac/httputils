const http = require('http')
const WebSocket = require('ws')

const {tail, catchError} = require('./http/error')
const {wsTail, catchUpgradeError} = require('./websocket/error')
const {WebSocketRouter} = require('./websocket')
const {HTTPRouter, METHODS} = require('./http')


class Application extends http.Server {

    constructor(Request, Response, webSocketOptions={}) {
        super({
            IncomingMessage: Request,
            ServerResponse: Response,
        })
        this.wss = new WebSocket.Server({ clientTracking: false, noServer: true, ...webSocketOptions})
        this.ws = new WebSocketRouter()
        this.http = new HTTPRouter()
    }

    async handleHTTPRequest(req, res) {
        req.relativeUrl = req.url
        await this.http.handle(req, res, () => {})
    }

    async handleWSUpgrade(req, socket, head) {
        req.relativeUrl = req.url
        
        this.ws.upgrade = (fn) => {
            let parentUrl = req.relativeUrl
            req.relativeUrl = req.url
            this.wss.handleUpgrade(req, socket, head, async websocket => {
                this.emit
                await fn(websocket, req)
            })
            req.relativeUrl = parentUrl
        }

        await this.ws.handle(req, socket, () => {})
    }

    listen() {
        this.http.use(tail, catchError)
        this.ws.use(wsTail, catchUpgradeError)
        this.on('request', this.handleHTTPRequest)
        this.on('upgrade', this.handleWSUpgrade)
        super.listen(...arguments)
    }
}

for(let method of METHODS) {
    Application.prototype[method.toLowerCase()] = function(path, handle) {
        this.httprouter[method.toLowerCase()](path, handle)
    }
}

module.exports = Application