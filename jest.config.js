module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  restoreMocks: true,
  clearMocks: true,
  resetMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    './**/src/**/*',
    '!./dist/**/*'
  ],
  extensionsToTreatAsEsm: ['.ts'],
};
