"use strict";

const base = require("./jest.config.base");

module.exports = {
  ...base,
  roots: ["<rootDir>"],
  projects: [
    "<rootDir>/packages/cli",
    "<rootDir>/packages/parser",
    "<rootDir>/packages/parser-buffer",
    "<rootDir>/packages/parser-goldsrc",
  ],
};
