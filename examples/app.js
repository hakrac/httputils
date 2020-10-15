const Application = require('../src/server')
const {HTTPRouter} = require('../src/http')
const {createApplication} = require('../src/index')
const {WebSocketRouter} = require('../src/websocket')
const { ApplicationRequest } = require('../src/request')
const http = require('../src/http')
const { ApplicationResponse } = require('../src/response')

class MyRequest extends ApplicationRequest {
    constructor() {
        super(...arguments)
    }

    test() {
        console.log('test')
    }
}

const app = createApplication(MyRequest, ApplicationResponse, true)

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

// const httprouter = new HTTPRouter()
// const httprouter2 = new HTTPRouter()

// httprouter.use((req, res, next) => {
//     console.log(req.params)
//     next()
// })

// httprouter2.use((req, res, next) => {
//     console.log(req.params)
//     next()
// })


// httprouter.use('/:bar', httprouter2)
// app.http.use('/:foo', httprouter)

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

app.ws.on('hello', message => {
    console.log('message', message)
})

app.listen(8080, '', () => {
    console.log('> Server listening on port 8080')
})