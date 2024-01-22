const fs = require('fs');
const path = require('path');

function buildPage() {
  const srcComponentsDir = path.join(__dirname, 'components');
  const srcStylesDir = path.join(__dirname, 'styles');
  const srcAssetsDir = path.join(__dirname, 'assets');
  const destDir = path.join(__dirname, 'project-dist');

  fs.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
    (templateErr, templateContent) => {
      if (templateErr) {
        console.error('Error reading template.html:', templateErr.message);
        process.exit(1);
      }

      fs.mkdir(destDir, { recursive: true }, (mkdirErr) => {
        if (mkdirErr) {
          console.error(
            'Error creating project-dist folder:',
            mkdirErr.message,
          );
          process.exit(1);
        }

        const indexContent = templateContent.replace(
          /{{(.*?)}}/g,
          (match, componentName) => {
            const componentPath = path.join(
              srcComponentsDir,
              componentName + '.html',
            );

            try {
              const componentContent = fs.readFileSync(componentPath, 'utf-8');
              return componentContent;
            } catch (componentErr) {
              console.error(`Error: Invalid template tag found: ${match}`);
              process.exit(1);
            }
          },
        );
        fs.writeFile(
          path.join(destDir, 'index.html'),
          indexContent,
          (writeIndexErr) => {
            if (writeIndexErr) {
              console.error('Error writing index.html:', writeIndexErr.message);
              process.exit(1);
            }

            const stylesContentArray = [];
            const styleFiles = fs.readdirSync(srcStylesDir);

            for (const styleFile of styleFiles) {
              if (path.extname(styleFile).toLowerCase() === '.css') {
                const stylePath = path.join(srcStylesDir, styleFile);
                const styleContent = fs.readFileSync(stylePath, 'utf-8');
                stylesContentArray.push(styleContent);
              }
            }

            const stylesContent = stylesContentArray.join('\n');
            fs.writeFile(
              path.join(destDir, 'style.css'),
              stylesContent,
              (writeStylesErr) => {
                if (writeStylesErr) {
                  console.error(
                    'Error writing style.css:',
                    writeStylesErr.message,
                  );
                  process.exit(1);
                }

                const destAssetsDir = path.join(destDir, 'assets');

                const copyAssets = (src, dest) => {
                  try {
                    fs.mkdirSync(dest, { recursive: true });

                    const files = fs.readdirSync(src);

                    for (const file of files) {
                      const srcPath = path.join(src, file);
                      const destPath = path.join(dest, file);

                      const stats = fs.statSync(srcPath);
                      if (stats.isDirectory()) {
                        copyAssets(srcPath, destPath);
                      } else {
                        fs.copyFileSync(srcPath, destPath);
                      }
                    }
                  } catch (copyAssetsErr) {
                    console.error(
                      'Error copying assets:',
                      copyAssetsErr.message,
                    );
                    process.exit(1);
                  }
                };

                copyAssets(srcAssetsDir, destAssetsDir);

                console.log('Build completed.');
              },
            );
          },
        );
      });
    },
  );
}

buildPage();
