module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/specs/*.spec.ts'],
  testEnvironment: 'node'
}
