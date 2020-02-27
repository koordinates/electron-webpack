"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureVue = configureVue;
exports.configureVueRenderer = configureVueRenderer;

var path = _interopRequireWildcard(require("path"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function configureVue(configurator) {
  if (!configurator.hasDependency("vue")) {
    return;
  }

  configurator.extensions.push(".vue");
  Object.assign(configurator.config.resolve.alias, {
    vue$: "vue/dist/vue.esm.js",
    "vue-router$": "vue-router/dist/vue-router.esm.js"
  });

  if (!configurator.isProduction && configurator.type === "main") {
    configurator.entryFiles.push(path.join(__dirname, "vue-main-dev-entry.js"));
  }
}

function configureVueRenderer(configurator) {
  configurator.entryFiles.push(path.join(__dirname, "../../../vue-renderer-entry.js"));
  configurator.debug("Vue detected");
  configurator.rules.push({
    test: /\.html$/,
    use: "vue-html-loader"
  }, {
    test: /\.vue$/,
    use: {
      loader: "vue-loader",
      options: {
        loaders: {
          sass: "vue-style-loader!css-loader!sass-loader?indentedSyntax=1",
          scss: "vue-style-loader!css-loader!sass-loader"
        }
      }
    }
  });

  const VueLoaderPlugin = require("vue-loader/lib/plugin");

  configurator.plugins.push(new VueLoaderPlugin());
} 
// __ts-babel@6.0.4
//# sourceMappingURL=vue.js.map