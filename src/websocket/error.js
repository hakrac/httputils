async function catchUpgradeError(err, req, socket, next) {
    console.warn(req.url + ': ' + err.message)
    socket.destroy()
}

async function wsTail(req, socket, next) {
    // nothing found
    socket.destroy()
}


module.exports = {
    catchUpgradeError,
    wsTail
}