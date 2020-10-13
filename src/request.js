const http = require('http')
const cookie = require('cookie')
const url = require('url')
const queryString = require('query-string')
const accepts = require('accepts')

class ApplicationRequest extends http.IncomingMessage {

    accepts(mimeTypes) {
        let accept = accepts(this)
        return accept.types(mimeTypes)
    }

    get(key) {
        return this.headers[key]
    }

    get xhr() {
        return get('X-Request-With') === 'XMLHttpRequest'
    }

    get hostname() {
        return url.parse(this.url).hostname
    }

    get originalUrl() {
        return this.url
    }

    get sercure() {
        return this.protocol === 'https'
    }

    get protocol() {
        return url.parse(this.url).protocol
    }

    get path() {
        return url.parse(this.url).pathname
    }

    get query() {
        return queryString.parse((url.parse(this.url).query))
    }

    get cookies() {
        return cookie.parse(this.get('Cookies'))
    }

}

module.exports = {
    ApplicationRequest
}