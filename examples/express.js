const express = require('express')

const app = express()


// app.use((req, res, next) => {
//     let start = new Date()
//     next()
//     let diff = new Date().getTime() - start.getTime()
//     res.write(process.memoryUsage().heapTotal / 1024 /1024 + ' MiB\n' + diff + ' ms')
//     res.end()
// })

// let last = null
// for(let i = 0; i < 1000; i++) {
//     last = last || app
//     let router = express.Router()
//     router.use('/', (req, res, next) => {
//         next()
//     })
//     last.use(router)
//     last = router
// }

app.get('/time/:name', (req, res) => {
    res.send(req.params.name)
})

app.listen(8080, () => {
    console.log('> Express server listening on port 8080...')
})