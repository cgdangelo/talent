"use strict";

module.exports = {
  "**/*.[jt]s?(x)": () => ["tsc -b", "eslint --cache --fix"],
};
