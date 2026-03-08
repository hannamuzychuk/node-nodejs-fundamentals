import fs from "fs/promises";
import path from "path";

const restore = async () => {
  try {
    const snapshotPath = path.resolve("snapshot.json");
    const restorePath = path.resolve("workspace_restored");

    try {
      await fs.access(snapshotPath);
    } catch {
      throw new Error("FS operation failed");
    }
    try {
      await fs.access(restorePath);
      await fs.rm(restorePath, { recursive: true, force: true });

    } catch(error) {
      if (error.code !== "ENOENT") throw error;
    }

    const snapshotRaw = await fs.readFile(snapshotPath, "utf-8");
    const snapshotData = JSON.parse(snapshotRaw);

    await fs.mkdir(restorePath, { recursive: true });

    for (const entry of snapshotData.entries) {
      const entryPath = path.join(restorePath, entry.path);

      if (entry.type === "directory") {
        await fs.mkdir(entryPath, { recursive: true });
      } else if (entry.type === "file") {
        const buffer = Buffer.from(entry.content, "base64");
        await fs.mkdir(path.dirname(entryPath), { recursive: true });
        await fs.writeFile(entryPath, buffer);
      }
    }
 
  } catch (error) {
  throw new Error("FS operation failed");
} 
};

await restore();
