import fs from 'node:fs';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

/**
 * @param {string} input
 * @param {string} output
 */
export async function csvToJson(input, output) {
    let data = '';

    const transform = new Transform({
        transform(chunk, _encoding, callback) {
            data += chunk.toString();
            callback();
        },

        flush(callback) {
            try {
                const lines = data.trim().split(/\r?\n/);
                const headers = (lines.shift() ?? '').split(',');

                const result = [];

                for (const line of lines) {
                    const values = line.split(',');

                    /** @type {Record<string, string>} */
                    const object = {};

                    headers.forEach((header, index) => {
                        object[header] = values[index] ?? '';
                    });

                    result.push(object);
                }

                this.push(JSON.stringify(result, null, 2));
                callback();
            } catch (error) {
                callback(error instanceof Error ? error : new Error());
            }
        }
    });

    await pipeline(
        fs.createReadStream(input),
        transform,
        fs.createWriteStream(output)
    );
}
