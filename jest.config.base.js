"use strict";

module.exports = {
  // collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/*.ts"],
  coverageDirectory: "<rootDir>/coverage/",
  coveragePathIgnorePatterns: ["<rootDir>/lib/", "<rootDir>/node_modules/"],
  // coverageThreshold: {
  //   global: {
  //     branches: 100,
  //     functions: 100,
  //     lines: 100,
  //     statements: 100,
  //   },
  // },
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  verbose: true,
};
