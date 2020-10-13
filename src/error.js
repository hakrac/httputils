function tail(req, res, next) {
    res.write('File Not Found')
    res.end()
}


function catchError(err, req, res, next) {
    res.write('Server Error ' + err)
    res.end()
}

module.exports = {
    tail,
    catchError
}