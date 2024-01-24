const fs = require('fs');
const path = require('path');

function copyDir() {
  const srcDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');

  // Remove all files from 'files-copy' folder
  fs.readdir(destDir, (readdirErr, destFiles) => {
    if (readdirErr) {
      console.error('Error reading destination directory:', readdirErr);
      return;
    }

    destFiles.forEach((file) => {
      const destFilePath = path.join(destDir, file);

      fs.unlink(destFilePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(
            `Error removing file ${file} from destination directory:`,
            unlinkErr,
          );
        }
      });
    });

    // Create or clear the destination directory
    fs.mkdir(destDir, { recursive: true }, (mkdirErr) => {
      if (mkdirErr) {
        console.error('Error creating destination directory:', mkdirErr);
        return;
      }

      // Read files in the source directory and copy them to the destination directory
      fs.readdir(srcDir, (readSrcDirErr, files) => {
        if (readSrcDirErr) {
          console.error('Error reading source directory:', readSrcDirErr);
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
  });
}

copyDir();
