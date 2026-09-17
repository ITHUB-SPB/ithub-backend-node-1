import fs from "node:fs/promises";
import path from "node:path";

const workspace = "./workspace";
const toWrt = {
  rootPath: path.resolve(workspace),
  entries: [],
};

const snapshot = async (workspace) => {
  try {
    const entries = await fs.readdir(workspace, { withFileTypes: true });

    for (const elem of entries) {
      const subfold = path.join(workspace, elem.name);
      const stat = await fs.stat(subfold);
      const relative_path = path.relative(
        toWrt.rootPath,
        path.resolve(subfold),
      );

      if (stat.isFile()) {
      }
      if (elem.isDirectory()) {
        toWrt.entries.push({
          path: relative_path,
          type: "directory",
        });
        await snapshot(subfold);
      } else {
        const content_base64 = await fs.readFile(subfold, {
          encoding: "base64",
        });

        toWrt.entries.push({
          path: relative_path,
          type: "file",
          size: stat.size,
          content: content_base64,
        });
      }
    }
  } catch (error) {
    console.error("FS operation failed");
  }
};

await snapshot(workspace);

try {
  const result_path = "./results";
  const file_path = path.join(result_path, "result_snapshot.json");

  const jsonString = JSON.stringify(toWrt, null, 4);
  await fs.writeFile(file_path, jsonString, "utf-8");
  console.log("+");
} catch (error) {
  console.error("-");
}
