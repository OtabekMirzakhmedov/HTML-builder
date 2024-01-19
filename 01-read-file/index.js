const fs = require('fs');
const readableStream = fs.createReadStream("text.txt", "utf-8");
readableStream.on('data', (chunk) => console.log(chunk));
