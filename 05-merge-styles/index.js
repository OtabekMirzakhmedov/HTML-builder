const fs = require('fs');
const path = require('path');
const srcStylesDir = path.join(__dirname, 'styles');
const destBundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

const files = fs.readdirSync(srcStylesDir);
const cssFiles = files.filter(
  (file) => path.extname(file).toLowerCase() === '.css',
);
const cssContentArray = [];

cssFiles.forEach((cssFile) => {
  const filePath = path.join(srcStylesDir, cssFile);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  cssContentArray.push(fileContent);
});

const bundleContent = cssContentArray.join('\n');
fs.writeFileSync(destBundleFile, bundleContent);
