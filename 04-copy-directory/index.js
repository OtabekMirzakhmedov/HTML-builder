const fs = require('fs');
const path = require('path');

function copyDir() {
  const srcDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  } else {
    fs.rmdirSync(destDir, { recursive: true });
    fs.mkdirSync(destDir, { recursive: true });
  }
  const files = fs.readdirSync(srcDir);

  files.forEach((file) => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);

    fs.copyFileSync(srcPath, destPath);
  });

  console.log('Directory copied successfully.');
}

copyDir();
