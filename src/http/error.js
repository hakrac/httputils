async function tail(req, res, next) {
    await res
        .status(404)
        .send(`Cannot find ${req.url}`)
}


async function catchError(err, req, res, next) {
    await res
        .status(500)
        .send(err.stack)
}

module.exports = {
    tail,
    catchError
}