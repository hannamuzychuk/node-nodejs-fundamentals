import fs from "fs";
import path from "path";
import zlib from "zlib";

const decompressDir = async () => {

  const compressedDir = path.resolve("workspace/compressed");
  const archivePath = path.join(compressedDir, "archive.br");
  const outputDir = path.resolve("workspace/decompressed");

  if (!fs.existsSync(compressedDir) || !fs.existsSync(archivePath)) {
    throw new Error("FS operation failed");
  }
  
   if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const input = fs.createReadStream(archivePath);
  const brotli = zlib.createBrotliDecompress();
  let buffer = "";
  let currentFile = null;
  input.pipe(brotli);
  brotli.on("data", (chunk) => {

    buffer += chunk.toString();
    const parts = buffer.split("\n");
    buffer = parts.pop();
    for (const part of parts) {

      if (!currentFile) {
        const filePath = path.join(outputDir, part);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        currentFile = fs.createWriteStream(filePath);
      } else {
        currentFile.write(part + "\n");
      }
    }

  });

  brotli.on("end", () => {
    if (currentFile) {
      currentFile.end();
    }
    console.log("Decompression finished");
  });

  brotli.on("error", (err) => {
    console.error("Error during decompression:", err.message);
  });
};

await decompressDir();
