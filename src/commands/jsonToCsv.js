import fs from 'node:fs';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

/**
 * @param {string} input
 * @param {string} output
 */
export async function jsonToCsv(input, output) {
    let data = '';

    const transform = new Transform({
        transform(chunk, _encoding, callback) {
            data += chunk.toString();
            callback();
        },

        flush(callback) {
            try {
                const objects = JSON.parse(data);
                const headers = Object.keys(objects[0]);

                this.push(headers.join(',') + '\n');

                for (const object of objects) {
                    const values = headers.map(header => object[header]);
                    this.push(values.join(',') + '\n');
                }

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
