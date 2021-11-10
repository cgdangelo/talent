/** @type {(displayName: string) => import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports.createJestProjectConfig = (displayName = "") => ({
  displayName,
  preset: "ts-jest",
  rootDir: "src",
});
