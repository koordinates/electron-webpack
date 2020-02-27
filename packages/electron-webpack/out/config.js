"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPackageMetadata = getPackageMetadata;
exports.getDefaultRelativeSystemDependentCommonSource = getDefaultRelativeSystemDependentCommonSource;
exports.getElectronWebpackConfiguration = getElectronWebpackConfiguration;

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

function _util() {
  const data = require("./util");

  _util = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function getPackageMetadata(projectDir) {
  return new (_lazyVal().Lazy)(() => (0, _util().orNullIfFileNotExist)((0, _fsExtra().readJson)(path.join(projectDir, "package.json"))));
}

function getDefaultRelativeSystemDependentCommonSource() {
  return path.join("src", "common");
}
/**
 * Return configuration with resolved staticSourceDirectory / commonDistDirectory / commonSourceDirectory.
 */


async function getElectronWebpackConfiguration(context) {
  const result = await (0, _readConfigFile().getConfig)({
    packageKey: "electronWebpack",
    configFilename: "electron-webpack",
    projectDir: context.projectDir,
    packageMetadata: context.packageMetadata
  });
  const configuration = result == null || result.result == null ? {} : result.result;

  if (configuration.staticSourceDirectory == null) {
    configuration.staticSourceDirectory = "static";
  }

  if (configuration.commonDistDirectory == null) {
    configuration.commonDistDirectory = "dist";
  }

  if (configuration.commonSourceDirectory == null) {
    configuration.commonSourceDirectory = getDefaultRelativeSystemDependentCommonSource();
  }

  configuration.commonDistDirectory = path.resolve(context.projectDir, configuration.commonDistDirectory);
  configuration.commonSourceDirectory = path.resolve(context.projectDir, configuration.commonSourceDirectory);

  if (configuration.renderer === undefined) {
    configuration.renderer = {};
  }

  if (configuration.main === undefined) {
    configuration.main = {};
  }

  if (configuration.projectDir == null) {
    configuration.projectDir = context.projectDir;
  }

  return configuration;
} 
// __ts-babel@6.0.4
//# sourceMappingURL=config.js.map