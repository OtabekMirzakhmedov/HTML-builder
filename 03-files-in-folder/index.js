const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    process.exit(1);
  }

  const filePaths = files.map((file) => path.join(folderPath, file));
  const fileStats = filePaths.filter((filePath) =>
    fs.statSync(filePath).isFile(),
  );

  fileStats.forEach((fileStat) => {
    const fileNameWithExtension = path.basename(fileStat);
    const fileName = path.parse(fileNameWithExtension).name;
    const fileExtension = path.extname(fileStat).slice(1);
    const fileSize = (fs.statSync(fileStat).size / 1024).toFixed(3);

    console.log(`${fileName}-${fileExtension}-${fileSize}kb`);
  });
});
