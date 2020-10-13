
function resolve(result) {
    if(result instanceof Promise) {
        return Promise.resolve()
    }
    return result
}

function promisify(fn) {
    return new Promise((res, rej) => {
        fn((err, value) => {
            if(err) {
                rej(err)
            } else {
                res(value)
            }
        })
    })
}

module.exports = {
    promisify
}