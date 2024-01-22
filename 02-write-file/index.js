const fs = require('fs');
const { stdin, stdout } = process;

const output = fs.createWriteStream('output.txt');

stdin.setEncoding('utf-8');

stdout.write('write your text\n');

process.on('SIGINT', () => {
  process.exit();
});

stdin.on('data', (chunk) => {
  output.write(chunk);
});

process.on('exit', () => {
  output.end();
  stdout.write('\nFinished');
});
