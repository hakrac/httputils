// isolates the function to changes made to the properties of the object
function isolate(fn, obj, ...props) {
    let copy = {}
    for(let prop of props) {
        copy[prop] = obj[prop]
    }

    return function() {
        for(let prop of props) {
            obj[prop] = copy[prop]
        }
        return fn(...arguments)
    }
}

module.exports = {
    isolate
}