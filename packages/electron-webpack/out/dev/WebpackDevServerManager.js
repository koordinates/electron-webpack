"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startRenderer = startRenderer;

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _main() {
  const data = require("../main");

  _main = function () {
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

function _ChildProcessManager() {
  const data = require("./ChildProcessManager");

  _ChildProcessManager = function () {
    return data;
  };

  return data;
}

function _devUtil() {
  const data = require("./devUtil");

  _devUtil = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require("debug")("electron-webpack");

function runWds(projectDir, env) {
  const isWin = process.platform === "win32";

  const webpackDevServerPath = require.resolve(path.join(".bin", "webpack-dev-server" + (isWin ? ".cmd" : "")));

  debug(`Start renderer WDS ${webpackDevServerPath} on ${env.ELECTRON_WEBPACK_WDS_PORT} port`);
  return (0, _ChildProcessManager().run)(webpackDevServerPath, ["--color", "--env.autoClean=false", "--config", path.join(__dirname, "../../webpack.renderer.config.js")], {
    env,
    cwd: projectDir
  });
} // 1. in another process to speedup compilation
// 2. some loaders detect webpack-dev-server hot mode only if run as CLI


async function startRenderer(projectDir, env) {
  const webpackConfigurator = await (0, _main().createConfigurator)("renderer", {
    production: false,
    configuration: {
      projectDir
    }
  });
  const sourceDir = webpackConfigurator.sourceDir; // explicitly set to null - do not handle at all and do not show info message

  if (sourceDir === null) {
    return;
  }

  const dirStat = await (0, _util().statOrNull)(sourceDir);

  if (dirStat == null || !dirStat.isDirectory()) {
    (0, _devUtil().logProcess)("Renderer", `No renderer source directory (${path.relative(projectDir, sourceDir)})`, _chalk().default.blue);
    return;
  }

  if (webpackConfigurator.hasDependency("electron-next")) {
    debug(`Renderer WDS is not started - there is electron-next dependency`);
    return;
  }

  const lineFilter = new CompoundRendererLineFilter([new OneTimeLineFilter("Project is running at "), new OneTimeLineFilter("webpack output is served from ")]);
  return await new Promise((resolve, reject) => {
    let devServerProcess;

    try {
      devServerProcess = runWds(projectDir, env);
    } catch (e) {
      reject(e);
      return;
    } //tslint:disable-next-line:no-unused-expression


    new (_ChildProcessManager().ChildProcessManager)(devServerProcess, "Renderer WDS", new (_ChildProcessManager().PromiseNotifier)(resolve, reject));
    devServerProcess.on("error", error => {
      if (reject == null) {
        (0, _devUtil().logError)("Renderer", error);
      } else {
        reject(error);
        reject = null;
      }
    });
    devServerProcess.stdout.on("data", data => {
      (0, _devUtil().logProcess)("Renderer", data, _chalk().default.blue, lineFilter);
      const r = resolve; // we must resolve only after compilation, otherwise devtools disconnected

      if (r != null && (data.includes(": Compiled successfully.") || data.includes(": Compiled with warnings."))) {
        resolve = null;
        r();
      }
    });
    (0, _devUtil().logProcessErrorOutput)("Renderer", devServerProcess);
  });
}

class OneTimeLineFilter {
  constructor(prefix) {
    this.prefix = prefix;
    this.filtered = false;
  }

  filter(line) {
    if (!this.filtered && line.startsWith(this.prefix)) {
      this.filtered = true;
      return false;
    }

    return true;
  }

}

class CompoundRendererLineFilter {
  constructor(filters) {
    this.filters = filters;
  }

  filter(line) {
    return !this.filters.some(it => !it.filter(line));
  }

} 
// __ts-babel@6.0.4
//# sourceMappingURL=WebpackDevServerManager.js.map