const http = require("http")
const {
    promisify
} = require('util')
const cookie = require('cookie')


class ApplicationResponse extends http.ServerResponse {

    send(body) {
        let chunk

        switch(typeof body) {
            case 'number':
                chunk = String(body)
                break
            case 'object':
                if(body) {
                    throw new Error('Body cannot be `null`')
                } else if(body instanceof Buffer) {
                    chunk = body
                } else {
                    chunk = body.toString()
                }
                break
            case 'string':
                chunk = body
                break
            case 'undefined':
                throw new Error('Body cannot be `undefined`')
        }

        this.end(chunk)
    }

    attachment(filename) {
    }

    append(key, value) {
        
    }

    json(object) {
        this.set('Content-Type', 'application/json')
        return this.send(JSON.stringify(object))
    }

    status(statusCode) {
        this.statusCode = statusCode
        return this
    }

    cookie(key, value, options) {
        this.append('Set-Cookie', cookie.serialize(key, String(value), options))
        return this
    }   
    
    set(key, value) {
        this.setHeader(key, value)
        return this
    }

    get(key) {
        return this.getHeader(key)
    }

    redirect(location) {
        this
            .status(302)
            .set('Location', location)
        return this
    }

    download() {

    }
    
}

module.exports = ApplicationResponse
