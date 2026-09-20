import fs from 'node:fs/promises';
import path from 'node:path';

const restore = async () => {
  const workspaceDir = 'workspace_restored';
  const snapshotFile = 'snapshot.json';

  try {
    await fs.access(snapshotFile);
    
    try {
      await fs.access(workspaceDir);
      throw new Error('FS operation failed');
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }

    const data = await fs.readFile(snapshotFile, 'utf-8');
    const snapshot = JSON.parse(data);

    for (const item of snapshot) {
      const targetPath = path.join(workspaceDir, item.path);
      if (item.type === 'directory') {
        await fs.mkdir(targetPath, { recursive: true });
      } else if (item.type === 'file') {
        const content = Buffer.from(item.content, 'base64').toString('utf-8');
        await fs.writeFile(targetPath, content);
      }
    }
  } catch (error) {
    if (error.code === 'ENOENT' || error.message === 'FS operation failed') {
      throw new Error('FS operation failed');
    }
    throw error;
  }
};

await restore();w