const http = require('http')
const WebSocket = require('ws')

const {tail, catchError} = require('./http/error')
const {wsTail, catchUpgradeError} = require('./websocket/error')
const WebSocketRouter = require('./websocket')
const MultiplexingRouter = require('./websocket/multiplexing')
const HTTPRouter = require('./http')
const METHODS = require('./http/methods')


class Application extends http.Server {

    constructor(Request, Response, wsMultiplexing=false, wsMultiplexingKey="channel", webSocketOptions={}) {
        super({
            IncomingMessage: Request,
            ServerResponse: Response,
        })
        this.wsMultiplexing = wsMultiplexing
        this.wss = new WebSocket.Server({ clientTracking: false, noServer: true, ...webSocketOptions})
        this.ws = wsMultiplexing ? 
            new MultiplexingRouter(wsMultiplexingKey) : 
            new WebSocketRouter()
        this.ws.broadcast = this.broadcast.bind(this)
        this.http = new HTTPRouter()
    }

    broadcast(message, ws) {
        let includeMe = ws ? false : true
        this.wss.clients.forEach(client => {
            if((includeMe || client !== ws) && client.readyState === WebSocket.OPEN) {
                client.send(message)
            }
        })
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
                this.wss.emit('connection', websocket, req)
                await fn(websocket, req)
            })
            req.relativeUrl = parentUrl
        }

        await this.ws.handle(req, socket, () => {})
    }

    listen() {
        this.http.use(tail, catchError)
        if(!this.wsMultiplexing) {
            this.ws.use(wsTail, catchUpgradeError)
        }
        this.on('request', this.handleHTTPRequest)
        this.on('upgrade', this.handleWSUpgrade)
        return super.listen(...arguments)
    }
}

for(let method of METHODS) {
    Application.prototype[method.toLowerCase()] = function(path, handle) {
        this.http[method.toLowerCase()](path, handle)
    }
}

module.exports = Application