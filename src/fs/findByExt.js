import fs from "fs/promises";
import path from "path";

const findByExt = async () => {
  const extIndex = process.argv.indexOf("--ext");
  let ext = ".txt";
  if (extIndex !== -1 && process.argv[extIndex + 1]) {
    ext = process.argv[extIndex + 1];
    if (!ext.startsWith(".")) ext = "." + ext;
  }

  const workspacePath = path.resolve("workspace");

  try {
    await fs.access(workspacePath);
  } catch {
    throw new Error("FS operation failed");
  }

  const filesFound = [];

  const scanDir = async (currentPath) => {
    const items = await fs.readdir(currentPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentPath, item.name);
      const relativePath = path.relative(workspacePath, fullPath);

      if (item.isDirectory()) {
        await scanDir(fullPath);
      } else if (item.isFile() && path.extname(item.name).toLocaleLowerCase() === ext.toLocaleLowerCase()) {
        filesFound.push(relativePath);
      }
    }
  };

  await scanDir(workspacePath);
  filesFound.sort();

  for (const file of filesFound) {
    console.log(file);
  }
}
await findByExt();
