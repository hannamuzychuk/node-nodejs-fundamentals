import fs from "fs";       
import path from "path"; 
import zlib from "zlib"

const compressDir = async () => {
 const sourceDir = path.resolve("workspace/toCompress");   
  const outputDir = path.resolve("workspace/compressed"); 
  
   if (!fs.existsSync(sourceDir)) {
    throw new Error("FS operation failed"); 
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const archivePath = path.join(outputDir, "archive.br");
  const output = fs.createWriteStream(archivePath);
  const brotli = zlib.createBrotliCompress();
  brotli.pipe(output); 

  const getAllFiles = (dir, rootDir) => {
    let filesList = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        filesList = filesList.concat(getAllFiles(fullPath, rootDir));
      } else if (entry.isFile()) {
        filesList.push(path.relative(rootDir, fullPath));
      }
    }
    return filesList;
  };

  const files = getAllFiles(sourceDir, sourceDir);

  for (const file of files) {
    const filePath = path.join(sourceDir, file);
    const fileStream = fs.createReadStream(filePath);
    brotli.write(file + "\n");

    await new Promise((resolve, reject) => {
      fileStream.pipe(brotli, { end: false }); 
      fileStream.on("end", resolve);           
      fileStream.on("error", reject);        
    });

    brotli.write("\n");
  }

  brotli.end();

  output.on("finish", () => {
    console.log(`Compression finished: ${archivePath}`);
  });

  output.on("error", (err) => {
    console.error("Error writing archive:", err.message);
  });
};

await compressDir();
