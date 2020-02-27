"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RendererTarget = exports.BaseRendererTarget = void 0;

function _fsExtra() {
  const data = require("fs-extra");

  _fsExtra = function () {
    return data;
  };

  return data;
}

function _lazyVal() {
  const data = require("lazy-val");

  _lazyVal = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _readConfigFile() {
  const data = require("read-config-file");

  _readConfigFile = function () {
    return data;
  };

  return data;
}

function _webpack() {
  const data = require("webpack");

  _webpack = function () {
    return data;
  };

  return data;
}

function _dll() {
  const data = require("../configurators/dll");

  _dll = function () {
    return data;
  };

  return data;
}

function _vue() {
  const data = require("../configurators/vue/vue");

  _vue = function () {
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

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

class BaseRendererTarget extends _BaseTarget().BaseTarget {
  constructor() {
    super();
  }

  configureRules(configurator) {
    super.configureRules(configurator);
    configurator.extensions.push(".css");
    const miniLoaders = [MiniCssExtractPlugin.loader, {
      loader: "css-loader",
      options: {
        modules: "global"
      }
    }];
    const cssHotLoader = configurator.isProduction ? miniLoaders : ["css-hot-loader"].concat(miniLoaders);

    if (!configurator.isProduction) {
      // https://github.com/shepherdwind/css-hot-loader/issues/37
      configurator.entryFiles.unshift("css-hot-loader/hotModuleReplacement");
    }

    configurator.rules.push({
      test: /\.css$/,
      use: cssHotLoader
    }, {
      test: /\.less$/,
      use: cssHotLoader.concat("less-loader")
    }, {
      test: /\.s([ac])ss$/,
      use: cssHotLoader.concat("sass-loader")
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      use: {
        loader: "url-loader",
        options: (0, _BaseTarget().configureFileLoader)("imgs")
      }
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: "url-loader",
      options: (0, _BaseTarget().configureFileLoader)("media")
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: {
        loader: "url-loader",
        options: (0, _BaseTarget().configureFileLoader)("fonts")
      }
    });

    if (configurator.hasDevDependency("ejs-html-loader")) {
      configurator.rules.push({
        test: /\.ejs$/,
        loader: "ejs-html-loader"
      });
    }

    if (configurator.hasDependency("vue")) {
      (0, _vue().configureVueRenderer)(configurator);
    } else {
      configurator.rules.push({
        test: /\.(html)$/,
        use: {
          loader: "html-loader"
        }
      });
    }
  }

  async configurePlugins(configurator) {
    configurator.debug("Add ExtractTextPlugin plugin");
    configurator.plugins.push(new MiniCssExtractPlugin({
      filename: `${configurator.type === "renderer-dll" ? "vendor" : "styles"}.css`
    }));
    await _BaseTarget().BaseTarget.prototype.configurePlugins.call(this, configurator);
  }

}

exports.BaseRendererTarget = BaseRendererTarget;

class RendererTarget extends BaseRendererTarget {
  constructor() {
    super();
  }

  async configurePlugins(configurator) {
    // not configurable for now, as in the electron-vue
    const customTemplateFile = path.join(configurator.projectDir, configurator.rendererTemplate);

    const HtmlWebpackPlugin = require("html-webpack-plugin");

    const nodeModulePath = configurator.isProduction ? null : path.resolve(require.resolve("electron"), "..", "..");
    let template;

    if (await (0, _util().statOrNull)(customTemplateFile)) {
      template = await (0, _fsExtra().readFile)(customTemplateFile, {
        encoding: "utf8"
      });
    } else {
      template = getDefaultIndexTemplate();
    }

    configurator.plugins.push(new HtmlWebpackPlugin({
      filename: "index.html",
      template: await generateIndexFile(configurator, nodeModulePath, template),
      minify: false,
      nodeModules: nodeModulePath
    }));

    if (configurator.isProduction) {
      configurator.plugins.push(new (_webpack().DefinePlugin)({
        __static: `process.resourcesPath + "/${configurator.staticSourceDirectory}"`
      }));
    } else {
      const contentBase = [path.join(configurator.projectDir, configurator.staticSourceDirectory), path.join(configurator.commonDistDirectory, "renderer-dll")];
      configurator.config.devServer = {
        contentBase,
        host: process.env.ELECTRON_WEBPACK_WDS_HOST || "localhost",
        port: process.env.ELECTRON_WEBPACK_WDS_PORT || 9080,
        hot: true,
        overlay: true
      };
    }

    await BaseRendererTarget.prototype.configurePlugins.call(this, configurator);
  }

}

exports.RendererTarget = RendererTarget;

async function computeTitle(configurator) {
  const titleFromOptions = configurator.electronWebpackConfiguration.title;

  if (titleFromOptions == null || titleFromOptions === false) {
    return null;
  }

  if (titleFromOptions !== true) {
    return titleFromOptions;
  }

  let title = configurator.metadata.productName;

  if (title == null) {
    const electronBuilderConfig = await (0, _readConfigFile().getConfig)({
      packageKey: "build",
      configFilename: "electron-builder",
      projectDir: configurator.projectDir,
      packageMetadata: new (_lazyVal().Lazy)(() => Promise.resolve(configurator.metadata))
    });

    if (electronBuilderConfig != null) {
      title = electronBuilderConfig.result.productName;
    }
  }

  if (title == null) {
    title = configurator.metadata.name;
  }

  return title;
}

function getDefaultIndexTemplate() {
  return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <div id="app"></div>
      </body>
    </html>`;
}

async function generateIndexFile(configurator, nodeModulePath, template) {
  // do not use add-asset-html-webpack-plugin - no need to copy vendor files to output (in dev mode will be served directly, in production copied)
  const assets = await (0, _dll().getDllAssets)(path.join(configurator.commonDistDirectory, "renderer-dll"), configurator);
  const scripts = [];
  const css = [];

  for (const asset of assets) {
    if (asset.endsWith(".js")) {
      scripts.push(`<script type="text/javascript" src="${asset}"></script>`);
    } else {
      css.push(`<link rel="stylesheet" href="${asset}">`);
    }
  }

  const title = await computeTitle(configurator);
  const filePath = path.join(configurator.commonDistDirectory, ".renderer-index-template.html");
  let html = template;

  if (title) {
    html = html.replace("</head>", `<title>${title}</title></head>`);
  }

  if (nodeModulePath) {
    html = html.replace("</head>", `<script>require('module').globalPaths.push("${nodeModulePath.replace(/\\/g, "/")}")</script></head>`);
  }

  html = html.replace("</head>", '<script>require("source-map-support/source-map-support.js").install()</script></head>');

  if (scripts.length) {
    html = html.replace("</head>", `${scripts.join("")}</head>`);
  }

  if (css.length) {
    html = html.replace("</head>", `${css.join("")}</head>`);
  }

  await (0, _fsExtra().outputFile)(filePath, html);
  return `!!html-loader?minimize=false&url=false!${filePath}`;
} 
// __ts-babel@6.0.4
//# sourceMappingURL=RendererTarget.js.map