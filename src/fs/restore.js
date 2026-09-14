import fs from "node:fs/promises";
import path from "node:path";

const restore = async () => {
  try {
    const snapshot = await fs.readFile("results/result_snapshot.json", "utf-8");
    const data = JSON.parse(snapshot);
    try {
      await fs.access("./workspace_restored");
      throw new Error("FS operation failed");
    } catch (error) {
      if (error.message === "FS operation failed") throw error;
    }
    for (const entry of data.entries) {
      const copy_workspace = "./workspace_restored";
      const full_path = path.join(copy_workspace, entry.path);
      if (entry.type === "directory") {
        await fs.mkdir(full_path, { recursive: true });
      } else {
        const parent_folder = path.dirname(full_path);
        await fs.mkdir(parent_folder, { recursive: true });
        await fs.writeFile(full_path, entry.content, "base64");
      }
    }
    console.log("+");
  } catch (error) {
    console.error("FS operation failed");
  }
};

await restore();
