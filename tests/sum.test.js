const { test } = require('node:test')
const assert = require('node:assert')

const { sum } = require('../src/math.js')

test('correct sum for positive numbers', () => {
    assert(sum(3, 6) === 9, "Проверка суммы: ожидалось 9")
})