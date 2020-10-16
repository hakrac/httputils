const {EventEmitter} = require('events')

class MultiplexingRouter extends EventEmitter {

    constructor(multiplexingKey, ...args) {
        super(...args)
        this.multiplexingKey = multiplexingKey
        this.stack = []
    }

    use(...handlers) {
        for(let handle of handlers) {
            this.stack.push({
                handle
            })
        }

    }

    handle(req, socket, out) {
        
        let idx = 0
        let next = () => {
            while(idx < this.stack.length) {
                let {handle} = this.stack[idx++]
                
                handle(req, socket, next)
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
    }


}

module.exports = MultiplexingRouter