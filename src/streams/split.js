import fs from "fs";
import path from "path";

const split = async () => {
  let linesPerChunk = 10;

  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--lines") {
      linesPerChunk = Number(args[i + 1]) || 10;
      i++;
    }
  }

  const sourcePath = path.resolve("source.txt");
  let leftover = ""; 
  let chunkCount = 1;
  let bufferLines = [];

  const readStream = fs.createReadStream(sourcePath, { encoding: "utf-8" });
  readStream.on("data", (chunk) => {
  const data = leftover + chunk.toString();
  const lines = data.split(/\r?\n/);
    leftover = lines.pop();
    
     for (const line of lines) {
       bufferLines.push(line);
       
       if (bufferLines.length === linesPerChunk) {
      
        const chunkFile = path.resolve(`chunk_${chunkCount}.txt`);
        fs.writeFileSync(chunkFile, bufferLines.join("\n") + "\n", "utf-8");
        chunkCount++;
        bufferLines = []; 
      }
    }
  });

  readStream.on("end", () => {
   
    if (leftover) bufferLines.push(leftover);
    if (bufferLines.length > 0) {
      const chunkFile = path.resolve(`chunk_${chunkCount}.txt`);
      fs.writeFileSync(chunkFile, bufferLines.join("\n") + "\n", "utf-8");
    }
    console.log(`Split finished: ${chunkCount} chunk(s) created`);
  });

  readStream.on("error", (err) => {
    console.error("Error reading source.txt:", err.message);
  });
};

await split();
