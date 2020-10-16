const {EventEmitter} = require('events')

class MultiplexingRouter extends EventEmitter {
    constructor(multiplexingKey="channel", ...args) {
        super(...args)
        this.multiplexingKey = multiplexingKey
        this.stack = []
        this.routers = []
    }

    use(...handlers) {
        for(let handle of handlers) {
            if(handle instanceof MultiplexingRouter) {
                this.routers.push(handle)
            } else {
                this.stack.push({
                    handle
                })
            }
        }
    }

    handle(req, socket, out) {
        let idx = 0
        let next = () => {
            while(idx < this.stack.length) {
                let {handle} = this.stack[idx++]
                
                return handle(req, socket, next)
            }

            this.upgrade(this.ws.bind(this))
        }

        next()
    }

    ws(ws, req) {
        this.emit('connection', ws, req)
        ws.on('message', message => {
            let data = JSON.parse(message)
            this.emit(data[this.multiplexingKey], data)
        })
        ws.on('close', () => {
            this.emit('close', ws, req)
        })

        for(let router of this.routers) {
            router.ws(ws, req)
        }
    }


}

module.exports = MultiplexingRouter