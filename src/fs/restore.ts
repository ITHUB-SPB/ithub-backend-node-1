import path from 'node:path'
import { readFile, writeFile, mkdir } from 'node:fs/promises'

const restore = async () => {
  try {
    const workspaceRestored = 'workspace_restored'
    await mkdir(workspaceRestored)
    const snapshot = JSON.parse((await readFile('snapshot.json')).toString())
    const files = snapshot.entries.filter((entry) => {
      return entry.type === "file"
    })
    files.map(async (file) => {
      const fullPath = path.join(workspaceRestored, file.path)
      const data = Buffer.from(file.contents, 'base64').toString('utf-8')
      writeFile(fullPath, data)
    })
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('FS operation failed')
    }
  }
};

await restore();
