"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MainTarget = void 0;

var path = _interopRequireWildcard(require("path"));

function _webpack() {
  const data = require("webpack");

  _webpack = function () {
    return data;
  };

  return data;
}

function _util() {
  const data = require("../util");

  _util = function () {
    return data;
  };

  return data;
}

function _BaseTarget() {
  const data = require("./BaseTarget");

  _BaseTarget = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class MainTarget extends _BaseTarget().BaseTarget {
  constructor() {
    super();
  }

  configureRules(configurator) {
    super.configureRules(configurator);
    configurator.rules.push({
      test: /\.(png|jpg|gif)$/,
      use: [{
        loader: "url-loader",
        // to avoid any issues related to asar, embed any image up to 10MB as data url
        options: (0, _BaseTarget().configureFileLoader)("imgs", 10 * 1024 * 1024)
      }]
    });
  }

  async configurePlugins(configurator) {
    await _BaseTarget().BaseTarget.prototype.configurePlugins.call(this, configurator);

    if (configurator.isProduction) {
      configurator.plugins.push(new (_webpack().DefinePlugin)({
        __static: `process.resourcesPath + "/${configurator.staticSourceDirectory}"`
      })); // do not add for main dev (to avoid adding to hot update chunks), our main-hmr install it

      configurator.plugins.push(new (_webpack().BannerPlugin)({
        banner: 'require("source-map-support/source-map-support.js").install();',
        test: /\.js$/,
        raw: true,
        entryOnly: true
      }));
      return;
    }

    configurator.entryFiles.push(path.join(__dirname, "../electron-main-hmr/main-hmr"));
    const devIndexFile = await (0, _util().getFirstExistingFile)(["index.dev.ts", "index.dev.js"], path.join(configurator.projectDir, "src/main"));

    if (devIndexFile != null) {
      configurator.entryFiles.push(devIndexFile);
    }
  }

} exports.MainTarget = MainTarget;
// __ts-babel@6.0.4
//# sourceMappingURL=MainTarget.js.map