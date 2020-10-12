const http = require("http");


class ApplicationResponse extends http.ServerResponse {


    json() {
        console.log('json')
    }

    status() {

    }

    cookie() {

    }   
    
    set() {

    }

    get() {

    }

    redirect() {

    }

    download() {

    }
    
}

module.exports = {
    ApplicationResponse
}