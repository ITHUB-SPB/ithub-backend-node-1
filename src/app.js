// import { add, subtract, PI } from './math.js' // ВАРИАНТ 1
import * as math from './math.js' // ВАРИАНТ 2

import Logger from './logger.cjs'

const logger = new Logger()

logger.log(math.sum(1, 3))
logger.log(math.subtract(0, math.PI))
