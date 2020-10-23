const Application = require('../src/server')
const HTTPRouter = require('../src/http')
const createApplication = require('../src/index')
const WebSocketRouter = require('../src/websocket')
const ApplicationRequest = require('../src/request')
const ApplicationResponse  = require('../src/response')
const MultiplexingRouter = require('../src/websocket/multiplexing')

class MyRequest extends ApplicationRequest {}

const app = createApplication(MyRequest, ApplicationResponse, { enabled: true, channelKey: 'channel' })

// const httprouter = new HTTPRouter()

// app.http.use((req, res, next) => {
//     let start = new Date()
//     next()
//     let diff = new Date() - start
//     res.end(process.memoryUsage().heapTotal / 1024 / 1024 + ' MiB\n' + diff + ' ms')
// })

// let last = null
// for(let i = 0; i < 1000; i++) {
//     last = last || httprouter
//     let router = new HTTPRouter()
//     router.use('/', async (req, res, next) => {
//         next()
//     })
//     last.use(router)
//     last = router
// }
// app.http.use(httprouter)

const httprouter = new HTTPRouter()
// const httprouter2 = new HTTPRouter()

httprouter.get('/test/:name',
    (req, res, next) => {
        console.log(req.params.name)
        next()
    },
    (req, res) => {
        res.send('Hello')
    }
)

// httprouter2.use((req, res, next) => {
//     console.log(req.params)
//     next()
// })

// httprouter.use('/:bar', httprouter2)

app.http.use(httprouter)

// app.http.use('/', (req, res, next) => {
//     next()
// })

// app.http.get('/:test', (req, res) => {
//     console.log(req.params)
//     res.write('Test')
//     res.end()
// })

// wsrouter2.use('/:name2', (req, socket, next) => {
//     console.log('wsrouter2')
//     console.log(req.params)
//     throw new Error('test')
//     next()
// })

// app.ws.use('/:greet', wsrouter2)
// app.ws.use('/:greet', wsrouter)

// const router = new MultiplexingRouter()

// router.on('hello', message => {
//     console.log('message hello', message)
// })


// const router2 = new MultiplexingRouter()

// router2.on('hello', message => {
//     console.log('message 2 hello', message)
// })

// router.use(router2 )
// app.ws.use(router)

app.listen(8082, '', () => {
    console.log('> Server listening on port 8082')
})
