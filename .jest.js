const libDir = process.env.LIB_DIR;

const transformIgnorePatterns = [
  '/dist/',
  '<rootDir>/node_modules/(?!lodash-es)',
  '<rootDir>/node_modules/(?!.*?/es/.*\\.js)',
  // Ignore modules without es dir.
  // Update: @babel/runtime should also be transformed
  'node_modules/(?!.*(@babel|lodash-es))[^/]+?/(?!(es|node_modules)/)',
];
const testPathIgnorePatterns = ['/node_modules/', 'node'];
module.exports = {
  testURL: 'http://localhost/',
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'vue'],
  modulePathIgnorePatterns: ['/_site/'],
  transform: {
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest',
    '.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    '.+\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  testRegex: libDir === 'dist' ? 'demo\\.test\\.ts$' : '.*\\.test\\.tsx$',
  testEnvironment: 'jest-environment-jsdom-fifteen',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // '^.*lodash-es.*\\.js': '<rootDir>/node_modules/babel-jest',
    '^.*ant-design-vue.*[.]?style|css|less.*$': 'jest-transform-stub',
  },
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  collectCoverage: process.env.COVERAGE === 'true',
  collectCoverageFrom: ['src/**/*.{ts,tsx,vue}'],
  testPathIgnorePatterns,
  transformIgnorePatterns,
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
