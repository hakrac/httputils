function tail(req, res, next) {
    res.write('File Not Found')
    res.end()
}


function catchError(err, req, res, next) {
    console.warn(err)
    res.write('Server Error')
    res.end()
}

module.exports = {
    tail,
    catchError
}