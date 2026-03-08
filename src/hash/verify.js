
import fs from "fs/promises";
import fsSync from "fs"; 
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const verify = async () => {
  const checksumPath = resolve(__dirname, "checksums.json"); // poprawiona nazwa

  let data;
  try {
    const fileContent = await fs.readFile(checksumPath, "utf-8");
    data = JSON.parse(fileContent);
  } catch (error) {
    throw new Error('FS operation failed');
  }

  const hasFile = (filePath) => {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash("sha256");
      const stream = fsSync.createReadStream(filePath);

      stream.on("data", (chunk) => hash.update(chunk));
      stream.on("end", () => resolve(hash.digest("hex")));
      stream.on("error", reject);
    });
  };

  for (const [file, expectedHash] of Object.entries(data)) {
    const filePath = resolve(__dirname, file);
    try {
      const actualHash = await hasFile(filePath);
      if (actualHash === expectedHash.toLowerCase()) {
        console.log(`${file} — OK`);
      } else {
        console.log(`${file} — FAIL`);
      }
    } catch (error) {
      console.log(`${file} — FAIL`);
    }
  }
};

await verify();