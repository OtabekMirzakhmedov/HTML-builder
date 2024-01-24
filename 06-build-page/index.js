const fs = require('fs');
const path = require('path');

function buildPage() {
  const projectDistDir = path.join(__dirname, 'project-dist');
  const assetsDir = path.join(projectDistDir, 'assets');
  const indexPath = path.join(projectDistDir, 'index.html');
  const stylePath = path.join(projectDistDir, 'style.css');

  fs.mkdir(projectDistDir, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating project-dist directory:', err);
      process.exit(1);
    }
    console.log('Project-dist directory created.');

    fs.mkdir(assetsDir, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating assets directory:', err);
        process.exit(1);
      }
      console.log('Assets directory created.');

      fs.open(indexPath, 'w', (err) => {
        if (err) {
          console.error('Error creating index.html:', err);
          process.exit(1);
        }
        console.log('Index.html file created.');

        let contentTemplate = '';
        fs.readFile(path.join(__dirname, 'template.html'), (err, data) => {
          if (err) {
            console.error('Error reading template.html:', err);
            process.exit(1);
          }
          contentTemplate = data.toString();

          fs.readdir(path.join(__dirname, 'components'), { withFileTypes: true }, (err, components) => {
            if (err) {
              console.error('Error reading components directory:', err);
              process.exit(1);
            }

            let componentsProcessed = 0;

            components.forEach((element) => {
              if (element.isFile()) {
                const tempComponent = element.name.slice(0, element.name.indexOf('.'));
                fs.readFile(path.join(__dirname, 'components', element.name), (err, data) => {
                  if (err) {
                    console.error(`Error reading component ${element.name}:`, err);
                    process.exit(1);
                  }
                  contentTemplate = contentTemplate.replace(`{{${tempComponent}}}`, data.toString());

                  componentsProcessed++;
                  if (componentsProcessed === components.length) {
                    fs.writeFile(indexPath, contentTemplate, (err) => {
                      if (err) {
                        console.error('Error writing index.html:', err);
                        process.exit(1);
                      }
                      console.log('Index.html content updated.');
                      createStyleFile();
                    });
                  }
                });
              } else {
                componentsProcessed++;
                if (componentsProcessed === components.length) {
                  createStyleFile();
                }
              }
            });
          });
        });
      });
    });
  });

  function createStyleFile() {
    fs.open(stylePath, 'w', (err) => {
      if (err) {
        console.error('Error creating style.css:', err);
        process.exit(1);
      }
      console.log('Style.css file created.');

      fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err, files) => {
        if (err) {
          console.error('Error reading styles directory:', err);
          process.exit(1);
        }

        files.forEach((file) => {
          if (file.isFile() && path.extname(file.name) === '.css') {
            fs.readFile(path.join(__dirname, 'styles', file.name), (err, data) => {
              if (err) {
                console.error(`Error reading style file ${file.name}:`, err);
                process.exit(1);
              }

              fs.appendFile(stylePath, data, (err) => {
                if (err) {
                  console.error('Error appending to style.css:', err);
                  process.exit(1);
                }
              });
            });
          }
        });

        console.log('Style.css content updated.');

        copyAssets();
      });
    });
  }

  function copyAssets() {
    fs.readdir(path.join(__dirname, 'assets'), (error, files) => {
      if (error) {
        console.error('Error reading assets directory:', error);
        process.exit(1);
      }
      console.log('Assets directory cleared.');

      let assetsProcessed = 0;

      files.forEach((file) => {
        const destFolder = path.join(assetsDir, file);

        fs.mkdir(destFolder, { recursive: true }, (err) => {
          if (err) {
            console.error(`Error creating destination folder ${destFolder}:`, err);
            process.exit(1);
          }
          console.log(`Destination folder ${destFolder} created.`);

          fs.readdir(path.join(__dirname, 'assets', file), (err, content) => {
            if (err) {
              console.error(`Error reading assets subfolder ${file}:`, err);
              process.exit(1);
            }

            content.forEach((item) => {
              const srcPath = path.join(__dirname, 'assets', file, item);
              const destPath = path.join(destFolder, item);

              fs.copyFile(srcPath, destPath, (err) => {
                if (err) {
                  console.error(`Error copying file ${item}:`, err);
                  process.exit(1);
                }

                assetsProcessed++;
                if (assetsProcessed === files.length) {
                  console.log('Assets copied successfully.');
                  console.log('Build completed.');
                }
              });
            });
          });
        });
      });
    });
  }
}

buildPage();
