const rimraf = require('rimraf');
const path = require('path');

const errorHandler = (err) => {
  console.error('err', err);
}

rimraf(path.resolve(__dirname, 'es'), errorHandler);
rimraf(path.resolve(__dirname, 'lib'), errorHandler);
