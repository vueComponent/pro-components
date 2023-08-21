export const getRewrites = (): Record<string, string> => {
  return {
    'packages/:pkg/example/(.*)': ':pkg/(.*)',
    'docs/(.*)': '(.*)'
  }
}
