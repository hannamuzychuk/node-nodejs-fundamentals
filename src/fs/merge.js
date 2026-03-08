import fs from "fs/promises";
import path from "path";

const merge = async () => {

  const filesArgIndex = process.argv.indexOf("--files");
  let filesToMerge = null;

  if (filesArgIndex !== -1 && process.argv[filesArgIndex + 1]) {
    filesToMerge = process.argv[filesArgIndex + 1].split(",");
  }

  const partsPath = path.resolve("workspace/parts");
  try {
    await fs.access(partsPath);
  } catch {
    throw new Error("FS operation failed");
  }
  let files = [];

  if (filesToMerge) {
    for (const file of filesToMerge) {
      const fullPath = path.join(partsPath, file);
      try {
        await fs.access(fullPath);
        files.push(fullPath);
      } catch {
        throw new Error("FS operation failed");
      }
    }
  } else {
    const items = await fs.readdir(partsPath);
    files = items
      .filter(file => file.endsWith(".txt"))
      .sort()
      .map(file => path.join(partsPath, file));
    
    if (files.length === 0) {
      throw new Error("FS operation failed");
    }
  }
 
  let mergedContent = "";
  for (const file of files) {
    const content = await fs.readFile(file, "utf-8");
    mergedContent += content + "\n";
  }

  const workspacePath = path.resolve("workspace");
   try {
    await fs.access(workspacePath);
  } catch {
    await fs.mkdir(workspacePath, { recursive: true });
  }
  
  const mergedPath = path.join(workspacePath, "merged.txt");
  await fs.writeFile(mergedPath, mergedContent);

console.log(`Merged ${files.length} files into ${mergedPath}`);
};

await merge();
