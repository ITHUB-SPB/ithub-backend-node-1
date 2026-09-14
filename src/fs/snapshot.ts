import path from 'node:path'
import { readdir, readFile } from 'node:fs/promises'

const snapshot = async () => {
  const files = await readdir('./data', { withFileTypes: true, recursive: true })
  const promises = files.map(async (file) => {
    const fullPath = path.join(file.parentPath, file.name)
    const data = file.isFile() ? await (await readFile(fullPath)).toString('base64') : null
    return { path: fullPath, ...(data && { contents: data }) }
  })
  const results = await Promise.all(promises)
  console.log(results)
};

await snapshot();
