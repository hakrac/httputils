const http = require('http')
const WebSocket = require('ws')

const {WebSocketRouter} = require('./websocket')
const {HTTPRouter, METHODS} = require('./http')


class Application extends http.Server {

    constructor() {
        super(...arguments)
        this.wss = new WebSocket.Server({ clientTracking: false, noServer: true })
        this.ws = new WebSocketRouter()
        this.http = new HTTPRouter()
    }

    async handleHTTPRequest(req, res) {
        req.relativeUrl = req.url
        let tail = () => {
            console.log('http tail')
        }
        await this.http.handle(req, res, tail)
    }

    async handleWSUpgrade(req, socket, head) {
        req.relativeUrl = req.url
        
        await this.ws.handleUpgrade(req, socket, head, () => {
            console.log('upgrade')
            let originalUrl = req.relativeUrl
            req.relativeUrl = req.url
            this.wss.handleUpgrade(req, socket, head, async websocket => {
                this.wss.emit('connection', websocket, req)
                await this.ws.handleConnection(websocket, req)
            })
            req.relativeUrl = originalUrl
        })
    }

    listen() {
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