"use strict";

module.exports = {
  "*.ts": () => ["tsc -b", "eslint --cache --fix"],
  "*": "prettier -u -w",
};
