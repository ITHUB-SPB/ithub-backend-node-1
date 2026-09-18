import fs from 'node:fs';
import crypto from 'node:crypto';
import { pipeline } from 'node:stream/promises';

/**
 * @param {string} input
 * @param {boolean} save
 */
export async function hashFile(input, save) {
    const hash = crypto.createHash('sha256');

    await pipeline(
        fs.createReadStream(input),
        hash
    );

    const result = `sha256: ${hash.digest('hex')}`;

    console.log(result);

    if (save) {
        const output = `${input}.sha256`;
        await fs.promises.writeFile(output, result);
    }
}