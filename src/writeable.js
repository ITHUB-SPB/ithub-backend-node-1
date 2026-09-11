import { createWriteStream } from 'node:fs'

const stream = createWriteStream('output.txt')

const data = [1, 2, 3, 4]

for (const item of data) {
    stream.write(String(item))
}