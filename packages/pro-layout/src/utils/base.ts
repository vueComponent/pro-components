export function warn(valid: boolean, message: string) {
  // Support uglify
  if (import.meta.env.DEV && !valid && console !== undefined) {
    console.error(`Warning: ${message}`)
  }
}

export function warning(valid: boolean, message: string) {
  warn(valid, `[@ant-design-vue/pro-layout] ${message}`)
}
