import fs from 'node:fs';
import crypto from 'node:crypto';
import { pipeline } from 'node:stream/promises';

/**
 * @param {string} input
 * @param {string} hashFile
 */
export async function compareHash(input, hashFile) {
    const hash = crypto.createHash('sha256');

    await pipeline(
        fs.createReadStream(input),
        hash
    );

    const actualHash = `sha256: ${hash.digest('hex')}`;
    const expectedHash = (await fs.promises.readFile(hashFile, 'utf8')).trim();

    if (actualHash === expectedHash) {
        console.log('OK');
    } else {
        console.log('MISMATCH');
    }
}