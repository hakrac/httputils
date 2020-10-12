const Application = require('../src/server')
const {HTTPRouter} = require('../src/http')
const {WebSocketRouter} = require('../src/websocket')

const app = new Application()

const httprouter = new HTTPRouter()
const test = new HTTPRouter()
const wsrouter = new WebSocketRouter()


wsrouter.use('/', async (req, socket, head, next) => {
    console.log('upgrade to websocket on /foo')
    await next()
})

wsrouter.connection('/bar', (ws, req) => {
    console.log('ws://foo/bar')
    ws.send('bar!!!')
})

app.ws.connection('/foo', wsrouter)


test.use('/hello', (req, res, next) => {
    next()
})

httprouter.use('/', (req, res, next) => {
    next()
})

httprouter.get('/hello', (req, res) => {
    res.write('Hello')
    res.end()
})

app.http.use('/foo', test)
app.http.use('/foo', httprouter)
app.ws.use(wsrouter)

app.listen(8080, '', () => {
    console.log('> Server listening on port 8080')
})