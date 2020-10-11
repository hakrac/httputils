const MULTI_PATH_WILDCARD = '*'


class Route {

    constructor(path) {
        path = this._sanitate(path)
    }

    _sanitate(path) {
        path = path
            .replace(MULTI_PATH_WILDCARD, '')
            .replace(/:(\w*?)/, '(?<$1>[^\/])')
            .replace(/^\//, '') 
            + '/'

        return path
        
    }

    match(urlInfo) {
        // check if url starts with this route
    }

    matchFull(urlInfo) {
        // check if url fully matches this route
    }

    relative(urlInfo) {
        // make url relative to this route
    }

}


module.exports = {
    Route,
    MULTI_PATH_WILDCARD
}