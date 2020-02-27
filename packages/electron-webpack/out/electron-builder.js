"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _config() {
  const data = require("./config");

  _config = function () {
    return data;
  };

  return data;
}

async function _default(context) {
  const electronWebpackConfig = await (0, _config().getElectronWebpackConfiguration)(context);
  const distDir = electronWebpackConfig.commonDistDirectory;
  return {
    extraMetadata: {
      main: "main.js"
    },
    files: [{
      from: ".",
      filter: ["package.json"]
    }, {
      from: `${distDir}/main`
    }, {
      from: `${distDir}/renderer`
    }, {
      from: `${distDir}/renderer-dll`
    }],
    extraResources: [{
      from: electronWebpackConfig.staticSourceDirectory,
      to: electronWebpackConfig.staticSourceDirectory
    }]
  };
} 
// __ts-babel@6.0.4
//# sourceMappingURL=electron-builder.js.map