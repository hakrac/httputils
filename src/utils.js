

function resolve(result) {
    if(result instanceof Promise) {
        return Promise.resolve()
    }
    return result
}