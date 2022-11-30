export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    coverageDirectory: 'target/coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
    collectCoverage: true,
    coveragePathIgnorePatterns : ['__tests__/*'],
    testRegex: '__tests__/[^.]+\\.test\\.ts',
    reporters : ['default']
  };