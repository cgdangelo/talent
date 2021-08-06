"use strict";

module.exports = {
  "*.ts": () => ["yarn build", "yarn lint --fix"],
  "*": "prettier -u -w",
};
