const path = require('path'),
  environment = require(path.join(__dirname, 'environment.prod.js')),
  environmentPath = path.join(__dirname, 'apps', 'default', 'src', 'environments', 'environment.prod.ts'),
  fs = require('fs');

fs.open(environmentPath, 'w', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile already exists');
      return;
    }
    throw err;
  }
  fs.writeSync(fd, `export const environment = ${JSON.stringify(environment)}`);
});
