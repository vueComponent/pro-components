const libDir = process.env.LIB_DIR;

const transformIgnorePatterns = [
  '/dist/',
  'node_modules/[^/]+?/(?!(node_modules)/)', // Ignore modules without es dir
];

module.exports = {
  testURL: 'http://localhost/',
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'vue'],
  modulePathIgnorePatterns: ['/_site/'],
  testPathIgnorePatterns: ['/node_modules/', 'node'],
  transform: {
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest',
    '^.+\\.(ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  testRegex: libDir === 'dist' ? 'demo\\.test\\.ts$' : '.*\\.test\\.tsx$',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  collectCoverage: process.env.COVERAGE === 'true',
  collectCoverageFrom: ['src/**/*.{ts,tsx,vue}'],
  transformIgnorePatterns,
  verbose: true,
};
