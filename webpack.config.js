const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    "Mova.js": "./src/Mova.js",
  },
  output: {
    filename: "MovaReady.bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};