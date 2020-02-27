"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureDll = configureDll;
exports.getDllAssets = getDllAssets;

function _fsExtra() {
  const data = require("fs-extra");

  _fsExtra = function () {
    return data;
  };

  return data;
}

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

async function configureDll(configurator) {
  let dllManifest = null;
  const projectDir = configurator.projectDir;

  if (configurator.type === "renderer-dll") {
    const dll = configurator.electronWebpackConfiguration.renderer.dll;

    if (dll == null) {
      throw new Error(`renderer-dll requires DLL configuration`);
    }

    configurator.config.entry = Array.isArray(dll) ? {
      vendor: dll
    } : dll;
    dllManifest = path.join(configurator.commonDistDirectory, configurator.type, "manifest.json");
    configurator.plugins.push(new (_webpack().DllPlugin)({
      name: "[name]",
      path: dllManifest,
      context: projectDir
    }));
    const output = configurator.config.output; // leave as default "var"

    delete output.libraryTarget;
    output.library = "[name]";
  } else if (configurator.type === "renderer") {
    const dllDir = path.join(configurator.commonDistDirectory, "renderer-dll");
    const dirStat = await (0, _util().statOrNull)(dllDir);

    if (dirStat == null || !dirStat.isDirectory()) {
      configurator.debug("No DLL directory");
      return null;
    }

    configurator.debug(`DLL directory: ${dllDir}`);
    configurator.plugins.push(new (_webpack().DllReferencePlugin)({
      context: projectDir,
      manifest: await (0, _fsExtra().readJson)(path.join(dllDir, "manifest.json"))
    }));
  }

  return dllManifest;
}

async function getDllAssets(dllDir, configurator) {
  if (configurator.electronWebpackConfiguration.renderer.dll == null) {
    return [];
  }

  const files = await (0, _util().orNullIfFileNotExist)((0, _fsExtra().readdir)(dllDir));
  return files == null ? [] : files.filter(it => it.endsWith(".js") || it.endsWith(".css")).sort();
} 
// __ts-babel@6.0.4
//# sourceMappingURL=dll.js.map