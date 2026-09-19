import { createReadStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pipeline } from 'node:stream/promises';
import { dirname, basename, join } from 'node:path';

/**
 * @param {string} input
 * @param {boolean} [save]
 * @returns {Promise<string>}
 */
export async function calculateHash(input, save = false) {
    const hash = createHash('sha256');

    await pipeline(
        createReadStream(input),
        hash,
    );

    const digest = hash.digest('hex');
    const result = `sha256: ${digest}`;

    console.log(result);

    if (save) {
        const hashFile = join(
            dirname(input),
            `${basename(input)}.sha256`,
        );

        await writeFile(hashFile, `${result}\n`, 'utf8');
    }

    return result;
}