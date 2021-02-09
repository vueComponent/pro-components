const libDir = process.env.LIB_DIR;

const testPathIgnorePatterns = ['/node_modules/', 'node'];
module.exports = {
  testURL: 'http://localhost/',
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'vue'],
  modulePathIgnorePatterns: ['/_site/', '/examples/'],
  transform: {
    // '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/jest/jestpreprocessor.js',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  testRegex: libDir === 'dist' ? 'demo\\.test\\.ts$' : '.*\\.test\\.tsx$',
  testEnvironment: 'jest-environment-jsdom-fifteen',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // '^.*ant-design/icons.*\\.js': '<rootDir>/node_modules/babel-jest',
    // '^.*lodash-es.*\\.js': '<rootDir>/node_modules/babel-jest',
    // '^.*ant-design-vue.*[.]?style|css|less.*$': 'jest-transform-stub',
  },
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  collectCoverage: process.env.COVERAGE === 'true',
  collectCoverageFrom: ['src/**/*.{ts,tsx,vue}'],
  testPathIgnorePatterns: ['/node_modules/', 'node'],
  transformIgnorePatterns: [
    '/dist/',
    // Ignore modules without es dir.
    // Update: @babel/runtime should also be transformed
    '<rootDir>/node_modules/(?!(lodash-es|ant-design-vue/es|@ant-design/icons-vue|@ant-design/icons-svg))',
  ],
  verbose: true,
  globals: {
    stubs: {
      transition: false,
      'transition-group': false,
    },
    'ts-jest': {
      babelConfig: true,
      tsconfig: {
        // allow js in typescript
        allowJs: true,
      },
    },
  },
};
