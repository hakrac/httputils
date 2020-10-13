const MULTI_PATH_WILDCARD = '*'


class Route {

    constructor(path=MULTI_PATH_WILDCARD, full=false) {
        let pattern
        
        if(path.trim() === MULTI_PATH_WILDCARD) {
            pattern = '.*'
        } else {
            pattern = '^\/' + path
                .replace(/:(\w*)/g, '(?<$1>\\w+)')  // replace params with group
                .replace(/^\/+/, '')                // remove intial slash
                .replace(/\/+$/, '')                // remove trailing slash
                .replace(/\^/, '' )                 // remove all carets
        }

        this.regPath = full ? new RegExp(pattern + '$') : new RegExp(pattern)
    }


    // check if path starts with this route
    match(path, http_method='GET') {
        path = Route.sanitize(path)
        return path.match(this.regPath)
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

