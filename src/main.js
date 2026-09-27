import fs from 'node:fs'
import { Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'

/**
 * @param {string} input
 * @param {string} output
 */
export async function csvToJson(input, output) {
    if (!input || !output) {
        throw new Error('Operation failed')
    }

    /** @type {string[]} */
    let headers = []

    let firstLine = true

    /** @type {Record<string, string>[]} */
    const result = []

    const transform = new Transform({
        transform(chunk, _encoding, callback) {
            try {
                const lines = chunk.toString().split('\n')

                for (let line of lines) {
                    line = line.trim()

                    if (!line) {
                        continue
                    }

                    if (firstLine) {
                        headers = line.split(',')
                        firstLine = false
                        continue
                    }

                    const values = line.split(',')

                    /** @type {Record<string, string>} */
                    const object = {}

                    for (let i = 0; i < headers.length; i++) {
                        object[headers[i] || ''] = values[i] || ''
                    }

                    result.push(object)
                }

                callback()
            } catch (error) {
                if (error instanceof Error) {
                    callback(error)
                } else {
                    callback(new Error(String(error)))
                }
            }
        },

        flush(callback) {
            this.push(JSON.stringify(result, null, 2))
            callback()
        }
    })

    await pipeline(
        fs.createReadStream(input),
        transform,
        fs.createWriteStream(output)
    )
}