module.exports = {
  plugins: {
    'postcss-prefix-selector': {
      prefix: ':not(:where(.code-box-demo *))',
      includeFiles: [/vp-doc\.css/],
      transform(prefix, _selector) {
        const [selector, pseudo = ''] = _selector.split(/(:\S*)$/)
        return selector + prefix + pseudo
      }
    }
  }
}
