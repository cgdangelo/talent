"use strict";

module.exports = {
  "*.ts": () => ["yarn build", "yarn lint --cache --fix"],
  "*": "prettier -u -w",
};
