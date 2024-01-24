const fs = require('fs');
const path = require('path');

function copyDir() {
  const srcDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');

  fs.mkdir(destDir, { recursive: true }, (mkdirErr) => {
    if (mkdirErr) {
      console.error('Error creating destination directory:', mkdirErr);
      return;
    }

    fs.readdir(srcDir, (readdirErr, files) => {
      if (readdirErr) {
        console.error('Error reading source directory:', readdirErr);
        return;
      }

      files.forEach((file) => {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);

        fs.copyFile(srcPath, destPath, (copyFileErr) => {
          if (copyFileErr) {
            console.error(`Error copying file ${file}:`, copyFileErr);
          }
        });
      });

      console.log('Directory copied successfully.');
    });
  });
}

copyDir();
