import fs from "fs/promises";
import os from "os";
import { Worker } from "worker_threads";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const main = async () => {
  const file = await fs.readFile("data.json", "utf-8");
  const numbers = JSON.parse(file);

  const cpuCount = os.cpus().length;
  const chunkSize = Math.ceil(numbers.length / cpuCount);
  const chunks = [];

  for (let i = 0; i < numbers.length; i += chunkSize) {
    chunks.push(numbers.slice(i, i + chunkSize));
  }

  const workerPath = join(__dirname, "worker.js");

  const promises = chunks.map((chunk) => {
    return new Promise((resolve, reject) => {

      const worker = new Worker(workerPath);

      worker.postMessage(chunk);

      worker.on("message", (sortedChunk) => {
        resolve(sortedChunk);
      });

      worker.on("error", reject);

    });
  });

  const sortedChunks = await Promise.all(promises);

  const merge = (arrays) => {
    const result = [];
    const indexes = new Array(arrays.length).fill(0);

    while (true) {

      let minValue = Infinity;
      let minArray = -1;

      for (let i = 0; i < arrays.length; i++) {

        const index = indexes[i];

        if (index < arrays[i].length && arrays[i][index] < minValue) {
          minValue = arrays[i][index];
          minArray = i;
        }

      }

      if (minArray === -1) break;

      result.push(minValue);
      indexes[minArray]++;

    }

    return result;
  };

  const finalSorted = merge(sortedChunks);

  console.log(finalSorted);
};

await main();