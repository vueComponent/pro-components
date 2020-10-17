import * as path from 'path';
import * as fs from 'fs-extra';

function rm(distName: string, suffix?: string[], ignores?: string[]) {
  const distPath = path.join(__dirname, '../', distName);
  if (!fs.existsSync(distPath)) {
    return;
  }

  const files = fs.readdirSync(distPath);

  files.forEach(name => {
    if (Array.isArray(ignores)) {
      if (ignores.includes(name)) {
        return;
      }
    }
    if (Array.isArray(suffix)) {
      if (suffix.find(s => name.endsWith(s))) {
        fs.removeSync(path.join(distPath, name));
      }
    }
  });
}

// ls | grep -v .jest.js | grep -v .eslintrc.js | grep -e '.d.ts' -e '.js$' | xargs rm
rm('./', ['.d.ts', '.js'], ['.eslintrc.js', '.jest.js', 'postcss.config.js']);

// rm ./es/icons/*.d.ts
rm('./es/icons/', ['.d.ts']);
