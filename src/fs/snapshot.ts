import fs from "node:fs/promises";
import path from "node:path";

const snapshot = async () => {
  const __dirname = import.meta.dirname;
  const workspaceAbsPath = path.join(__dirname, "workspace");

  try {
    await fs.access(workspaceAbsPath);
  } catch {
    throw new Error("FS operation failed");
  }

  let entries: any = [];

  const scan = async (dir: string) => {
    const nested = await fs.readdir(dir);

    for (const value of nested) {
      let obj = {};
      const pathOfValue = path.join(dir, value);
      const stats = await fs.stat(pathOfValue);
      if (stats.isFile()) {
        const buf = await fs.readFile(pathOfValue)
        const content = buf.toString('base64')
        const relPathVal = path.relative(workspaceAbsPath, pathOfValue);
        obj = {
          path: relPathVal,
          type: "file",
          size: stats.size,
          content: content,
        };
        entries.push(obj);
      } else if (stats.isDirectory()){
        const recPath = path.join(dir, value);
        const relPathDir = path.relative(workspaceAbsPath, recPath);
        obj = { path: relPathDir, type: "directory" };
        entries.push(obj);
        await scan(recPath);
      }
    }
  };
  await scan(workspaceAbsPath);
  const data = `{
    "rootPath": ${JSON.stringify(workspaceAbsPath)},
    "entries": ${JSON.stringify(entries)}
    }`;
  const filePath = path.join(__dirname, "snapshot.json");
  await fs.writeFile(filePath, data);
};

await snapshot();
