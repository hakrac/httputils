const MULTI_PATH_WILDCARD = '*'


class Route {

    constructor(path=MULTI_PATH_WILDCARD, http_method='GET') {
        let pattern
        
        if(path.trim() === MULTI_PATH_WILDCARD) {
            pattern = '.*'
        } else {
            pattern = '^\/' + path
                .replace(/:(\w*)/g, '(?<$1>\\w+)')   // replace params with group
                .replace(/^\/+/, '')                // remove intial slash
                .replace(/\/+$/, '')                // remove trailing slash
                .replace(/\^/, '' )                 // remove all carets
        }

        this.regPath = new RegExp(pattern)
        this.regPathGlobal = new RegExp(pattern + '$')
        this.method = http_method
    }


    // check if path starts with this route
    match(path, http_method='GET') {
        path = Route.sanitize(path)
        return this.method === http_method && path.match(this.regPath)
    }


    // check if path fully matches this route
    matchFull(path, http_method='GET') {
        path = Route.sanitize(path)
        return this.method === http_method && path.match(this.regPathGlobal)
    }

    // make path relative to this route
    relative(path) {
        path = Route.sanitize(path)
        return path.replace(this.regPath, '') || '/'
    }

}

Route.sanitize = function(path) {
    return '/' + path
        .replace(/^\//, '')                         // remove intial slash
        .replace(/\/$/, '')                         // remove trailing slash
}

module.exports = {
    Route
}

