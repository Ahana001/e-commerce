/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  coverageProvider: 'v8',
  roots: ['<rootDir>/src'],
  testTimeout: 30000,
  transform: {'^.+\\.tsx?$': 'ts-jest'},
};
