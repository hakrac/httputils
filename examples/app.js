const Application = require('../src/server')
const {HTTPRouter} = require('../src/http')

const app = new Application()

const router = new HTTPRouter()

app.use('/', (req, res, next) => {
    console.log('request', req.relativeUrl)
    next()
})

app.get('/test', (req, res) => {
    res.write('Hello')
    res.end()
})

router.use('/', (req, res, next) => {
    res.write('Hello \n')
    next()
    res.end()
})

router.get('/bar', (req, res) => {
    res.write('/foo/bar')
})


app.use('/foo', router)


app.listen(8080, '', () => {
    console.log('> Server listening on port 8080')
})