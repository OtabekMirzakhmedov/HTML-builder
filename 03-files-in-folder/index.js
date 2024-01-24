const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    process.exit(1);
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    fs.stat(filePath, (statErr, fileStat) => {
      if (statErr) {
        console.error(`Error processing file ${filePath}:`, statErr);
        return;
      }

      if (fileStat.isFile()) {
        const fileNameWithExtension = path.basename(filePath);
        const fileName = path.parse(fileNameWithExtension).name;
        const fileExtension = path.extname(filePath).slice(1);
        const fileSize = (fileStat.size / 1024).toFixed(3);

        console.log(`${fileName}-${fileExtension}-${fileSize}kb`);
      }
    });
  });
});
