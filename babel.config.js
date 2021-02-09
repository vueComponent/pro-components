module.exports = {
  env: {
    test: {
      presets: [['@babel/preset-env', { targets: { node: true } }]],
      plugins: [
        '@vue/babel-plugin-jsx',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-transform-object-assign',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-runtime',
        '@babel/plugin-transform-modules-commonjs',
        // 'transform-es2015-modules-commonjs',
      ],
    },
  },
};
