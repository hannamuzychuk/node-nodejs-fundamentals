import { Transform } from "stream";

const filter = () => {
  const args = process.argv.slice(2);
  let pattern = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--pattern") {
      pattern = args[i + 1];
      i++;
    }
  }

  if (!pattern) {
    console.error("Error: missing --pattern argument");
    process.exit(1);
  }

  let leftover = "";

  const transformStream = new Transform({
    transform(chunk, encoding, callback) {
      const data = leftover + chunk.toString();
      const lines = data.split(/\r?\n/);
      leftover = lines.pop();

      const filtered = lines.filter((line) => line.includes(pattern));

      if (filtered.length > 0) {
        this.push(filtered.join("\n") + "\n");
      }
      callback();
    },
    flush(callback) {
      if (leftover && leftover.includes(pattern)) {
        this.push(leftover + "\n");
      }
      callback();
    },
  });

  process.stdin.pipe(transformStream).pipe(process.stdout);
};

filter();
