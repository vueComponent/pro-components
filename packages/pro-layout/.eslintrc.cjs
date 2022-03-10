/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
  ],
  env: {
    'vue/setup-compiler-macros': true,
  },
  rules: {
    'prettier/prettier': ['error', { semi: false, singleQuote: true, printWidth: 120 }],
    // 临时关掉
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
