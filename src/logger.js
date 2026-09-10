class Logger {
    log(message) {
        const currentTime = new Date().toLocaleString('ru')
        console.log(`${currentTime}\t ${message}`)
    }
}

module.exports = Logger