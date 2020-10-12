const http = require('http')
const WebSocket = require('ws')

const {WebSocketRouter} = require('./websocket')
const {HTTPRouter, METHODS} = require('./http')


class Application extends http.Server {

    constructor() {
        super(arguments)
        this.wss = new WebSocket.Server({ clientTracking: false, noServer: true })
        this.ws = new WebSocketRouter()
        this.http = new HTTPRouter()
    }

    handleHTTPRequest(req, res) {
        req.relativeUrl = req.url
        let tail = () => {}
        this.httprouter.handle(req, res, tail)
    }

    handleWSUpgrade(req, socket, head) {
        req.relativeUrl = req.url
        
        this.ws.handleUpgrade(req, socket, head, () => {
            console.log('upgrade')
            this.wss.handleUpgrade(req, socket, head, websocket => {
                this.ws.handleConnection(websocket, req)
                this.wss.emit('connection', websocket, req)
            })
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