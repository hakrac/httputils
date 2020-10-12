const Application = require('../src/server')
const {HTTPRouter} = require('../src/http')
const {WebSocketRouter} = require('../src/websocket')

const app = new Application()

const httprouter = new HTTPRouter()
const wsrouter = new WebSocketRouter()


app.http.use('/', (req, res, next) => {
    console.log('request', req.relativeUrl)
    next()
})

app.http.get('/test', (req, res) => {
    res.write('Hello')
    res.end()
})

httprouter.use('/', (req, res, next) => {
    res.write('Hello \n')
    next()
    res.end()
})

httprouter.get('/bar', (req, res) => {
    res.write('/foo/bar')
})

wsrouter.upgrade('/', (req, socket, head, next) => {
    console.log('upgrade to websocket on /foo')
    next()
})

wsrouter.connection('/bar', (ws, req) => {
    console.log('ws/bar')
    ws.send('bar!!!')
})

app.ws.connection('/foo', wsrouter)
app.http.use('/foo', httprouter)


app.listen(8080, '', () => {
    console.log('> Server listening on port 8080')
})
