const fs = require('fs');
const path = require('path');

function buildPage() {
  const srcComponentsDir = path.join(__dirname, 'components');
  const srcStylesDir = path.join(__dirname, 'styles');
  const srcAssetsDir = path.join(__dirname, 'assets');
  const destDir = path.join(__dirname, 'project-dist');

  fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (templateErr, templateContent) => {
    if (templateErr) {
      console.error('Error reading template.html:', templateErr.message);
      process.exit(1);
    }

    fs.mkdir(destDir, { recursive: true }, (mkdirErr) => {
      if (mkdirErr) {
        console.error('Error creating project-dist folder:', mkdirErr.message);
        process.exit(1);
      }

      const indexContent = templateContent.replace(/{{(.*?)}}/g, (match, componentName) => {
        const componentPath = path.join(srcComponentsDir, componentName + '.html');

        try {
          const componentContent = fs.readFileSync(componentPath, 'utf-8');
          return componentContent;
        } catch (componentErr) {
          console.error(`Error: Invalid template tag found: ${match}`);
          process.exit(1);
        }
      });

      fs.writeFile(path.join(destDir, 'index.html'), indexContent, (writeIndexErr) => {
        if (writeIndexErr) {
          console.error('Error writing index.html:', writeIndexErr.message);
          process.exit(1);
        }

        fs.readdir(srcStylesDir, (readStylesErr, styleFiles) => {
          if (readStylesErr) {
            console.error('Error reading styles directory:', readStylesErr.message);
            process.exit(1);
          }

          const stylesContentArray = [];

          const processStyleFile = (index) => {
            if (index < styleFiles.length) {
              const styleFile = styleFiles[index];

              if (path.extname(styleFile).toLowerCase() === '.css') {
                const stylePath = path.join(srcStylesDir, styleFile);

                fs.readFile(stylePath, 'utf-8', (readStyleErr, styleContent) => {
                  if (readStyleErr) {
                    console.error(`Error reading style file ${styleFile}:`, readStyleErr.message);
                  } else {
                    stylesContentArray.push(styleContent);
                  }

                  processStyleFile(index + 1);
                });
              } else {
                processStyleFile(index + 1);
              }
            } else {
              const stylesContent = stylesContentArray.join('\n');

              fs.writeFile(path.join(destDir, 'style.css'), stylesContent, (writeStylesErr) => {
                if (writeStylesErr) {
                  console.error('Error writing style.css:', writeStylesErr.message);
                  process.exit(1);
                }

                const destAssetsDir = path.join(destDir, 'assets');

                const copyAssets = (src, dest, callback) => {
                  fs.mkdir(dest, { recursive: true }, (mkdirErr) => {
                    if (mkdirErr) {
                      console.error('Error creating destination assets folder:', mkdirErr.message);
                      process.exit(1);
                    }

                    fs.readdir(src, (readAssetsErr, files) => {
                      if (readAssetsErr) {
                        console.error('Error reading assets directory:', readAssetsErr.message);
                        process.exit(1);
                      }

                      let count = files.length;

                      if (count === 0) {
                        callback();
                      }

                      const decrementAndCheck = () => {
                        count--;
                        if (count === 0) {
                          callback();
                        }
                      };

                      files.forEach((file) => {
                        const srcPath = path.join(src, file);
                        const destPath = path.join(dest, file);

                        fs.stat(srcPath, (statErr, stats) => {
                          if (statErr) {
                            console.error(`Error getting stats for ${srcPath}:`, statErr.message);
                            process.exit(1);
                          }

                          if (stats.isDirectory()) {
                            copyAssets(srcPath, destPath, decrementAndCheck);
                          } else {
                            fs.copyFile(srcPath, destPath, (copyFileErr) => {
                              if (copyFileErr) {
                                console.error(`Error copying file ${file}:`, copyFileErr.message);
                                process.exit(1);
                              }

                              decrementAndCheck();
                            });
                          }
                        });
                      });
                    });
                  });
                };

                copyAssets(srcAssetsDir, destAssetsDir, () => {
                  console.log('Build completed.');
                });
              });
            }
          };

          processStyleFile(0);
        });
      });
    });
  });
}

buildPage();
