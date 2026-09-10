const math = require('./math.js') // ВАРИАНТ 1
// const { sum, subtract, PI } = require('./math.js') // ВАРИАНТ 2
const Logger = require('./logger.js')

const logger = new Logger()

logger.log(math.sum(1, 3))
logger.log(math.subtract(0, math.PI))
