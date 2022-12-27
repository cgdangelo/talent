const { createJestProjectConfig } = require("../../createJestProjectConfig");

module.exports = createJestProjectConfig(require("./package.json").name);
