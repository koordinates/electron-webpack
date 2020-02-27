#!/usr/bin/env node
"use strict";

var path = _interopRequireWildcard(require("path"));

function _yargs() {
  const data = _interopRequireDefault(require("yargs"));

  _yargs = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// not strict because we allow to pass any webpack args
// tslint:disable-next-line:no-unused-expression
_yargs().default.command(["app", "compile", "*"], "Compile application", yargs => yargs, argv => build("app")).command(["main"], "Compile main process", yargs => yargs, argv => build("main")).command(["renderer"], "Compile renderer process", yargs => yargs, argv => build("renderer")).command(["dll"], "Compile DLL bundles", yargs => yargs, argv => build("renderer.dll")).command(["dev"], "Run a development mode", yargs => yargs, argv => runInDevMode()).argv;

function build(configFile) {
  const args = process.argv; // if command `electron-webpack` - remove first 2 args, if `electron-webpack compile` (or any other subcommand name) - 3

  const sliceIndex = args.length > 2 && !args[2].startsWith("-") ? 3 : 2;
  const extraWebpackArgs = sliceIndex < args.length ? args.slice(sliceIndex) : []; // remove extra args

  args.length = 2;

  if (!extraWebpackArgs.some(it => it.includes("--env.production"))) {
    args.push("--env.production");
  }

  args.push("--progress");
  args.push(...extraWebpackArgs);
  args.push("--config", path.join(__dirname, "..", `webpack.${configFile}.config.js`));

  require("yargs")(args.slice(2));

  require(require.resolve("webpack-cli"));
}

function runInDevMode() {
  require("./dev/dev-runner");
} 
// __ts-babel@6.0.4
//# sourceMappingURL=cli.js.map