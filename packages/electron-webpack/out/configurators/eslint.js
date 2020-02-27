"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureEslint = configureEslint;

function configureEslint(configurator) {
  const hasPreset = configurator.hasDevDependency("electron-webpack-eslint");

  if (!(hasPreset || configurator.hasDevDependency("eslint") && configurator.hasDevDependency("eslint-loader"))) {
    return;
  }

  const options = {
    cwd: configurator.projectDir
  };

  if (hasPreset || configurator.hasDevDependency("eslint-friendly-formatter")) {
    options.formatter = require("eslint-friendly-formatter");
  }

  configurator.rules.push({
    test: /\.(jsx?|tsx?|vue)$/,
    enforce: "pre",
    exclude: /node_modules/,
    loader: "eslint-loader",
    options
  });
} 
// __ts-babel@6.0.4
//# sourceMappingURL=eslint.js.map