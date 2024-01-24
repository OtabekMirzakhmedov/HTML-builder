const fs = require('fs');
const path = require('path');

const srcStylesDir = path.join(__dirname, 'styles');
const destBundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(srcStylesDir, (readdirErr, files) => {
  if (readdirErr) {
    console.error('Error reading source directory:', readdirErr);
    return;
  }

  const cssFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === '.css',
  );
  const cssContentArray = [];

  cssFiles.forEach((cssFile) => {
    const filePath = path.join(srcStylesDir, cssFile);
    fs.readFile(filePath, 'utf-8', (readFileErr, fileContent) => {
      if (readFileErr) {
        console.error(`Error reading file ${cssFile}:`, readFileErr);
        return;
      }

      cssContentArray.push(fileContent);

      if (cssContentArray.length === cssFiles.length) {
        const bundleContent = cssContentArray.join('\n');
        fs.writeFile(destBundleFile, bundleContent, (writeFileErr) => {
          if (writeFileErr) {
            console.error('Error writing bundled file:', writeFileErr);
          } else {
            console.log('Bundle created successfully.');
          }
        });
      }
    });
  });
});
