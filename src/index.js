const ApplicationRequest = require('./request')
const ApplicationResponse = require('./response')
const Application = require('./server')

function createApplication(Request=ApplicationRequest, Response=ApplicationResponse, wsMultiplexing) {
    return new Application(Request, Response, wsMultiplexing)
}

module.exports = createApplication