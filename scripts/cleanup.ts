import rimraf from 'rimraf';
import path from 'path';

const errorHandler = err => {
  if (err !== null) {
    console.warn(err);
  }
};

rimraf(path.resolve(__dirname, '../es'), errorHandler);
rimraf(path.resolve(__dirname, '../lib'), errorHandler);
