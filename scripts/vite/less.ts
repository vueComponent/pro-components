import fs from 'fs-extra';
import { resolve, dirname } from 'path';
import { normalizePath } from 'vite';

import type { Plugin, ResolvedConfig } from 'vite';

const excludeRegx = /node_modules/;
export default (): Plugin => {
  let config: ResolvedConfig;
  let output: string;
  const src = resolve('./src');
  const charset = 'utf-8';
  const maps = new Map<string, string>();
  return {
    name: 'vite-plugin-lessmerge',
    enforce: 'pre',
    apply: 'build',
    configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig;
      output = resolve(config.build.outDir);
    },
    transform(code: string, id: string) {
      if (!id.endsWith('.less') || excludeRegx.test(id)) {
        return;
      }
      const filePath = id.replace(src, output);
      maps.set(filePath, code);
      return code;
    },
    async closeBundle() {
      maps.forEach((code, file) => {
        fs.mkdirsSync(dirname(file));
        fs.outputFileSync(normalizePath(file), code, charset);
      });

      // exports .less
      fs.copySync(resolve(src, 'default.less'), resolve(output, 'default.less'));
      fs.copySync(resolve(src, 'index.less'), resolve(output, 'style.less'));
    },
  };
};
