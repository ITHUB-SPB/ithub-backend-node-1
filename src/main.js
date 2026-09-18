import { csvToJson } from './commands/csvToJson.js';
import { jsonToCsv } from './commands/jsonToCsv.js';
import { hashFile } from './commands/hash.js';
import { compareHash } from './commands/hashCompare.js';

const args = process.argv.slice(2);
const command = args[0];

/**
 * @param {string} name
 * @returns {string | undefined}
 */
function getArgument(name) {
    const index = args.indexOf(name);
    return index !== -1 ? args[index + 1] : undefined;
}

try {
    if (command === 'csv-to-json') {
        const input = getArgument('--input');
        const output = getArgument('--output');

        if (!input || !output) {
            throw new Error();
        }

        await csvToJson(input, output);
    } else if (command === 'json-to-csv') {
        const input = getArgument('--input');
        const output = getArgument('--output');

        if (!input || !output) {
            throw new Error();
        }

        await jsonToCsv(input, output);
    } else if (command === 'hash') {
        const input = getArgument('--input');
        const save = args.includes('--save');

        if (!input) {
            throw new Error();
        }

        await hashFile(input, save);
    } else if (command === 'hash-compare') {
        const input = getArgument('--input');
        const hash = getArgument('--hash');

        if (!input || !hash) {
            throw new Error();
        }

        await compareHash(input, hash);
    } else {
        throw new Error();
    }
} catch {
    console.error('Operation failed');
    process.exitCode = 1;
}