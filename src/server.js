const http = require('http')
const WebSocket = require('ws')
const url = require('url')

class Application extends http.Server {

    constructor() {
        super(arguments)
        this.wss = new WebSocket.Server({ clientTracking: false, noServer: true })
        this.wsrouter = new WebSocketRouter()
        this.httprouter = new HTTPRouter()
    }

    use() {
        this.httprouter.use(arguments)
    }

    upgrade() {
        this.wsrouter.upgrade(arguments)
    }

    ws() {
        this.wsrouter.ws(arguments)
    }

    handleHTTPRequest(req, res) {
        let tail = () => {

        }
        this.httprouter.handle(req, res, tail)
    }

    handleWSUpgrade(req, socket, head) {
        this.wsrouter.handleUpgrade(req, socket, head, () => {
            this.wss.handleUpgrade(req, socket, head, ws => {
                this.wsrouter.handleConnnection(ws)
                this.wss.emit('connection', ws)
            })
        })
    }

    listen() {
        this.on('request', this.handleHTTPRequest)
        this.on('upgrade', this.handleWSUpgrade)
        super.listen(arguments)
    }
}

for(let method of http.METHODS) {
    Application.prototype[method] = (path, handle) => {
        this.httprouter[method](path, handle)
    }
}

module.exports = Application