import fs from 'node:fs';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

/**
 * @param {string} input
 * @param {string} output
 */
export async function csvToJson(input, output) {
    /** @type {string[]} */
    let headers = [];

    let buffer = '';
    let firstLine = true;
    let firstObject = true;

    const transform = new Transform({
        transform(chunk, encoding, callback) {
            void encoding;
            buffer += chunk.toString();

            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
                if (!line.trim()) continue;

                const values = line.trim().split(',');

                if (firstLine) {
                    headers = values;
                    firstLine = false;
                    this.push('[\n');
                    continue;
                }

                /** @type {Record<string, string>} */
                const obj = {};

                headers.forEach((header, index) => {
                    obj[header] = values[index] ?? '';
                });

                if (!firstObject) {
                    this.push(',\n');
                }

                this.push(`  ${JSON.stringify(obj)}`);
                firstObject = false;
            }

            callback();
        },

        flush(callback) {
            if (buffer.trim()) {
                const values = buffer.trim().split(',');

                /** @type {Record<string, string>} */
                const obj = {};

                headers.forEach((header, index) => {
                    obj[header] = values[index] ?? '';
                });

                if (!firstObject) {
                    this.push(',\n');
                }

                this.push(`  ${JSON.stringify(obj)}`);
            }

            this.push('\n]\n');
            callback();
        }
    });

    await pipeline(
        fs.createReadStream(input),
        transform,
        fs.createWriteStream(output)
    );
}