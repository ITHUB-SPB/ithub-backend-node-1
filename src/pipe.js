import { createReadStream, createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { createGzip } from 'node:zlib'

pipeline(
    createReadStream('pipe.txt', { autoClose: false }),
    createGzip(),
    createWriteStream('pipe.gz')
)

// for (let ix = 0; ix < 1_000; ix++) {
//     const randomNumber = (Math.random() * 2000 - 1000).toFixed()
//     writeStream.write(randomNumber.toString() + '\n')
// }

// writeStream.close()

// for await (const chunk of readStream) {
//     console.log(chunk.toString())
// }

// console.log('Данных для чтения больше нет')

// writeStream.on('close', () => {
//     console.log('Данных для записи больше нет')
// })