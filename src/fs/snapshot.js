import fs from "fs/promises";
import path from "path";

const snapshot = async () => {
  try {
    const workspacePath = path.resolve("workspace");
    
    try {
      await fs.access(workspacePath);
      } catch {
      await fs.mkdir(workspacePath, { recursive: true });
      console.log("Automatically creates the 'workspace' directory if it does not exist.");
    }
  
    const entries = [];

    const scanDirectory = async (currentPath) => {
      const items = await fs.readdir(currentPath, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(currentPath, item.name);
        const relativePath = path.relative(workspacePath, fullPath);

        if (item.isDirectory()) {
          entries.push({
            path: relativePath,
            type: "directory"
          });

          await scanDirectory(fullPath);
        }
        else if (item.isFile()) {
          const fileBuffer = await fs.readFile(fullPath);

          entries.push({
            path: relativePath,
            type: "file",
            size: fileBuffer.length,
            content: fileBuffer.toString("base64")
          });
        }
      }
    };

    await scanDirectory(workspacePath);

    const snapshotData = {
      rootPath: workspacePath,
      entries: entries
    };
    const snapshotPath = path.join(path.dirname(workspacePath), "snapshot.json");

    await fs.writeFile(
     snapshotPath, JSON.stringify(snapshotData, null, 2)
    );

    console.log(`Snapshot saved to ${snapshotPath}`);
  } catch (error) {
    console.error("FS operation failed:", error.message);
    throw error;
  }
};

await snapshot();
