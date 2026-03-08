import { Transform } from "stream";

const lineNumberer = () => {
  
    let lineCount = 0;

    const transformStream = new Transform({
      readableHighWaterMark: 1024,
      writableHighWaterMark: 1024,
      transform(chunk, encoding, callback) {
        const data = chunk.toString();

        const lines = data.split(/\r?\n/);

        const numberedLines = lines.map((line) => {
          if (line.trim() === "") return "";
          lineCount++;
          return `${lineCount} | ${line}`;
        });

        const output = numberedLines.join("\n");
        this.push(output + "\n");
        
        callback();
      }
    });

    process.stdin.pipe(transformStream).pipe(process.stdout); 
  
};

lineNumberer();
