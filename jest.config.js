/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  collectCoverage: true,
  preset: "ts-jest",
  projects: ["<rootDir>/packages/*/jest.config.js"],
  testEnvironment: "node",
  verbose: true,
};
