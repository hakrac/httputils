const Application = require('../src/server')
const {HTTPRouter} = require('../src/http')
const {createApplication} = require('../src/index')
const {WebSocketRouter} = require('../src/websocket')
const { ApplicationRequest } = require('../src/request')

class MyRequest extends ApplicationRequest {
    constructor() {
        super(...arguments)
        console.log('construct')
    }

    test() {
        console.log('test')
    }
}

const app = createApplication(MyRequest)

app.http.get('/', (req, res) => {
    req.test()
    res.json()
    res.write('Hello')
    res.end()
})

app.ws.use('/:test', (req, socket, head, next) => {
    next()
})

app.ws.connection('/:name', (ws, req) => {
    console.log(req.params)
    ws.send('Hello')
})

app.listen(8080, '', () => {
    console.log('> Server listening on port 8080')
})