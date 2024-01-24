const fs = require('fs');
const { stdin, stdout } = process;

const output = fs.createWriteStream('./02-write-file/output.txt');

stdin.setEncoding('utf-8');

stdout.write('write your text\n');

process.on('SIGINT', () => {
  process.exit();
});

stdin.on('data', (chunk) => {
  const input = chunk.trim();
  if (input.toLowerCase() === 'exit') {
    process.exit();
  }

  // Write the input to the file
  output.write(input + '\n');
});

process.on('exit', () => {
  output.end();
  stdout.write('\nFinished');
});
