import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

/**
 * @param {unknown} value
 * @returns {string}
 */
function escapeCsvValue(value) {
    if (value === null || value === undefined) {
        return '';
    }

    const stringValue = String(value);

    if (
        stringValue.includes(',') ||
        stringValue.includes('"') ||
        stringValue.includes('\n') ||
        stringValue.includes('\r')
    ) {
        return `"${stringValue.replaceAll('"', '""')}"`;
    }

    return stringValue;
}

/**
 * @param {AsyncIterable<Buffer | string>} source
 * @returns {AsyncGenerator<string>}
 */
async function* transformJsonToCsv(source) {
    let json = '';

    for await (const chunk of source) {
        json += chunk.toString();
    }

    /** @type {unknown} */
    let data;

    try {
        data = JSON.parse(json);
    } catch {
        throw new Error('Invalid JSON');
    }

    if (!Array.isArray(data)) {
        throw new Error('Invalid JSON');
    }

    if (data.length === 0) {
        return;
    }

    if (
        data.some(
            (item) =>
                typeof item !== 'object' ||
                item === null ||
                Array.isArray(item),
        )
    ) {
        throw new Error('Invalid JSON');
    }

    /** @type {string[]} */
    const headers = [];

    for (const item of data) {
        if (typeof item !== 'object' || item === null) {
            throw new Error('Invalid JSON');
        }

        for (const key of Object.keys(item)) {
            if (!headers.includes(key)) {
                headers.push(key);
            }
        }
    }

    if (headers.length === 0) {
        return;
    }

    yield `${headers.map(escapeCsvValue).join(',')}\n`;

    for (const item of data) {
        if (typeof item !== 'object' || item === null) {
            throw new Error('Invalid JSON');
        }

        const row = headers.map((header) => {
            return escapeCsvValue(item[header]);
        });

        yield `${row.join(',')}\n`;
    }
}

/**
 * @param {string} input
 * @param {string} output
 * @returns {Promise<void>}
 */
export async function jsonToCsv(input, output) {
    await pipeline(
        createReadStream(input),
        transformJsonToCsv,
        createWriteStream(output),
    );
}