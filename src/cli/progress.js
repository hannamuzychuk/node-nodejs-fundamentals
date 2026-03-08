const progress = () => {

  let duration = 5000;
  let interval = 100;
  let length = 30;
  let color = null;

  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--duration":
        duration = Number(args[i + 1]) || duration;
        i++;
        break;
      case "--interval":
        interval = Number(args[i + 1]) || interval;
        i++;
        break;
      case "--length":
        length = Number(args[i + 1]) || length;
        i++;
        break;
       case "--color":
        const c = args[i + 1];
        if (/^#([0-9A-Fa-f]{6})$/.test(c)) {
          color = c;
        }
        i++;
        break;
    }
  }

  const colorize = color ? (text) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `\x1b[38;2;${r};${g};${b}m${text}\x1b[0m`;
  }
    : (text) => text;
  
  let start = Date.now();
  let timer = setInterval(() => {
    let elapsed = Date.now() - start;
    let percent = Math.min(elapsed / duration, 1);
    let filledLength = Math.round(length * percent);
    let bar = colorize('█'.repeat(filledLength)) + ' '.repeat(length - filledLength);
    process.stdout.write(`\r[${bar}] ${Math.round(percent * 100)}%`);
    if (percent >= 1) {
      clearInterval(timer);
      console.log('\nDone!');
    }
  }, interval);

};

progress();
