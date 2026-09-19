import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

/**
 * @param {string} line
 * @returns {string[]}
 */
function parseCsvLine(line) {
    const values = [];
    let value = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
        const character = line[i];

        if (character === '"') {
            if (insideQuotes && line[i + 1] === '"') {
                value += '"';
                i += 1;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (character === ',' && !insideQuotes) {
            values.push(value);
            value = '';
        } else {
            value += character;
        }
    }

    if (insideQuotes) {
        throw new Error('Invalid CSV');
    }

    values.push(value);

    return values;
}

/**
 * @param {AsyncIterable<Buffer | string>} source
 * @returns {AsyncGenerator<string>}
 */
async function* transformCsvToJson(source) {
    let buffer = '';
    /** @type {string[] | null} */
    let headers = null;
    let firstObject = true;

    yield '[\n';

    for await (const chunk of source) {
        buffer += chunk.toString();

        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() ?? '';

        for (const line of lines) {
            if (line.trim() === '') {
                continue;
            }

            const values = parseCsvLine(line);

            if (headers === null) {
                headers = values.map((header) => header.trim());

                if (
                    headers.length === 0 ||
                    headers.some((header) => header === '')
                ) {
                    throw new Error('Invalid CSV');
                }

                continue;
            }

            if (values.length !== headers.length) {
                throw new Error('Invalid CSV');
            }

            /** @type {Record<string, string>} */
            const object = {};

            for (let i = 0; i < headers.length; i += 1) {
                const header = headers[i];
                const value = values[i];

                if (header === undefined || value === undefined) {
                    throw new Error('Invalid CSV');
                }

                object[header] = value;
            }

            if (!firstObject) {
                yield ',\n';
            }

            yield `  ${JSON.stringify(object)}`;
            firstObject = false;
        }
    }

    if (buffer.trim() !== '') {
        const values = parseCsvLine(buffer);

        if (headers === null) {
            headers = values.map((header) => header.trim());

            if (
                headers.length === 0 ||
                headers.some((header) => header === '')
            ) {
                throw new Error('Invalid CSV');
            }
        } else {
            if (values.length !== headers.length) {
                throw new Error('Invalid CSV');
            }

            /** @type {Record<string, string>} */
            const object = {};

            for (let i = 0; i < headers.length; i += 1) {
                const header = headers[i];
                const value = values[i];

                if (header === undefined || value === undefined) {
                    throw new Error('Invalid CSV');
                }

                object[header] = value;
            }

            if (!firstObject) {
                yield ',\n';
            }

            yield `  ${JSON.stringify(object)}`;
        }
    }

    if (headers === null) {
        throw new Error('Invalid CSV');
    }

    yield '\n]\n';
}

/**
 * @param {string} input
 * @param {string} output
 * @returns {Promise<void>}
 */
export async function csvToJson(input, output) {
    await pipeline(
        createReadStream(input),
        transformCsvToJson,
        createWriteStream(output),
    );
}