import path from 'node:path'
import { readdir, readFile, writeFile, stat } from 'node:fs/promises'

const snapshot = async () => {
  try {
    const workspace = 'data'
    const files = await readdir(workspace, { withFileTypes: true, recursive: true })
    const promises = files.map(async (file) => {
      const fullPath = path.join(file.parentPath, file.name)
      const data = file.isFile() ? await (await readFile(fullPath)).toString('base64') : null
      const filetype = file.isFile() ? "file" : "directory"
      return {
        path: path.relative(workspace, fullPath),
        type: filetype,
        ...(file.isFile() && { size: (await stat(fullPath)).size }),
        ...(file.isFile() && { contents: data })
      }
    })
    const results = {
      rootPath: workspace,
      entries: await Promise.all(promises)
    }
    writeFile('snapshot.json', JSON.stringify(results, null, 2))
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('FS operation failed')
    }
  }
};

await snapshot();
