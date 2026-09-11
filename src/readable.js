// dd if=/dev/zero of=bigfile.txt bs=1M count=4096

import { createReadStream } from 'node:fs'
import { readFile } from 'node:fs/promises'

// const data = await readFile('bigfile.txt')

const stream = createReadStream('bigfile.txt', { highWaterMark: 1_024_000 })

let chunksQuantity = 0
let chunksTotalSize = 0

// PUSH-СТРАТЕГИЯ

// stream.on('data', (chunk) => {
//     const chunkSize = chunk.length

//     chunksQuantity++
//     chunksTotalSize += chunkSize

//     console.log(chunk)
//     console.log(`Chunk № ${chunksQuantity}, size ${chunkSize}`)
// })

// stream.on('end', () => {
//     console.log(`Read ${chunksQuantity} chunks`)
//     console.log(`Total size is ${chunksTotalSize}`)
// })

// PULL-стратегия

for await (const chunk of stream) {
    const chunkSize = chunk.length

    chunksQuantity++
    chunksTotalSize += chunkSize

    console.log(chunk)
    console.log(`Chunk № ${chunksQuantity}, size ${chunkSize}`)
}

console.log(`Read ${chunksQuantity} chunks`)
console.log(`Total size is ${chunksTotalSize}`)