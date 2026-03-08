import { spawn } from "child_process";

const execCommand = () => {
 
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Error: command not specified");
    process.exit(1);
  }

  const [command, ...commandArgs] = args.join(" ").split(" ");

  const child = spawn(command, commandArgs, {
    stdio: "inherit", 
    env: process.env  
  });


  child.on("exit", (code) => {
    process.exit(code);
  });

  child.on("error", (err) => {
    console.error("Failed to start command:", err.message);
    process.exit(1);
  });
};

execCommand();
