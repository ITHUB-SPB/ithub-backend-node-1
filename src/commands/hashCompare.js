import { readFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { pipeline } from 'node:stream/promises';

/**
 * @param {string} input
 * @param {string} hashFile
 * @returns {Promise<boolean>}
 */
export async function compareHash(input, hashFile) {
    const expectedContent = await readFile(hashFile, 'utf8');

    const expectedHash = expectedContent
        .trim()
        .replace(/^sha256:\s*/i, '')
        .trim()
        .toLowerCase();

    if (!/^[a-f0-9]{64}$/.test(expectedHash)) {
        throw new Error('Invalid hash');
    }

    const hash = createHash('sha256');

    await pipeline(
        createReadStream(input),
        hash,
    );

    const actualHash = hash.digest('hex');

    if (actualHash === expectedHash) {
        console.log('OK');
        return true;
    }

    console.log('MISMATCH');
    return false;
}