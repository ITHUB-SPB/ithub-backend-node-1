import { csvToJson } from './commands/csvToJson.js';
import { jsonToCsv } from './commands/jsonToCsv.js';
import { calculateHash } from './commands/hash.js';
import { compareHash } from './commands/hashCompare.js';

/**
 * @typedef {Object} CommandOptions
 * @property {string} [input]
 * @property {string} [output]
 * @property {string} [hash]
 * @property {boolean} [save]
 */

/**
 * @param {string[]} args
 * @returns {CommandOptions}
 */
function parseArguments(args) {
    /** @type {CommandOptions} */
    const options = {};

    for (let i = 0; i < args.length; i += 1) {
        const argument = args[i];

        if (argument === undefined || !argument.startsWith('--')) {
            continue;
        }

        const key = argument.slice(2);

        if (key === 'save') {
            options.save = true;
            continue;
        }

        const value = args[i + 1];

        if (value === undefined || value.startsWith('--')) {
            throw new Error('Operation failed');
        }

        if (key === 'input') {
            options.input = value;
        } else if (key === 'output') {
            options.output = value;
        } else if (key === 'hash') {
            options.hash = value;
        } else {
            throw new Error('Operation failed');
        }

        i += 1;
    }

    return options;
}

/**
 * @param {CommandOptions} options
 * @param {'input' | 'output' | 'hash'} name
 * @returns {string}
 */
function getRequiredOption(options, name) {
    const value = options[name];

    if (typeof value !== 'string' || value.length === 0) {
        throw new Error('Operation failed');
    }

    return value;
}

/**
 * @returns {Promise<void>}
 */
async function main() {
    const [command, ...args] = process.argv.slice(2);
    const options = parseArguments(args);

    switch (command) {
        case 'csv-to-json':
            await csvToJson(
                getRequiredOption(options, 'input'),
                getRequiredOption(options, 'output'),
            );
            break;

        case 'json-to-csv':
            await jsonToCsv(
                getRequiredOption(options, 'input'),
                getRequiredOption(options, 'output'),
            );
            break;

        case 'hash': {
            const input = getRequiredOption(options, 'input');

            await calculateHash(input, options.save === true);
            break;
        }

        case 'hash-compare':
            await compareHash(
                getRequiredOption(options, 'input'),
                getRequiredOption(options, 'hash'),
            );
            break;

        default:
            throw new Error('Operation failed');
    }
}

try {
    await main();
} catch {
    console.error('Operation failed');
    process.exitCode = 1;
}