import readline from 'node:readline';

const interactive = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ">"
  });

  console.log('Welcome! Type a command (uptime, cwd, date, exit):');
  rl.prompt();

  rl.on("line", (line) => {
    const command = line.trim();

    if (command === "uptime") {
      console.log(`Uptime: ${process.uptime().toFixed(2)}s`)
    } else if (command === "cwd") {
      console.log(`Current directory: ${process.cwd()}`);
    } else if (command === "date") {
      console.log(`Date and time: ${new Date().toISOString()}`);
    } else if (command === "exit") {
      console.log('Goodbye!');
      rl.close();
      return
    } else {
      console.log('Unknown command');
    }

    rl.prompt();
  });

  rl.on("SIGINT", () => {
    console.log('\nGoodbye!');
    rl.close();
  });

  rl.on("close", () => {
    process.exit(0);
  })
}
interactive();
