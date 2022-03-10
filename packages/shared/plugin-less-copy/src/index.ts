import { resolve } from 'path'
import { normalizePath, type Plugin } from 'vite'

const excludeRegx = /node_modules/

function createPlugin(): Plugin {
  const maps = new Map<string, string>()
  const srcDir = normalizePath(resolve('./src/'))

  return {
    name: 'vite-plugin-less-copy',
    enforce: 'pre',
    apply: 'build',
    transform(code: string, id: string) {
      if (!id.endsWith('.less') || excludeRegx.test(id)) {
        return
      }

      maps.set(id, code)
      return code
    },

    generateBundle() {
      maps.forEach((code, file) => {
        this.emitFile({
          type: 'asset',
          fileName: file.replace(srcDir, '').substring(1),
          source: code,
        })
      })
    },
  }
}

export default createPlugin
