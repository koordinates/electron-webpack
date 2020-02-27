"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HmrClient = void 0;

function _crocket() {
  const data = _interopRequireDefault(require("crocket"));

  _crocket = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require("debug")("electron-webpack:main-client-hmr");

class HmrClient {
  constructor(socketPath, hot, currentHashGetter) {
    this.hot = hot;
    this.currentHashGetter = currentHashGetter;
    this.lastHash = null;
    this.ipc = new (_crocket().default)();

    if (hot == null) {
      throw new Error(`[HMR] Hot Module Replacement is disabled.`);
    }

    this.ipc.connect({
      path: socketPath
    }, error => {
      if (error != null) {
        console.error(error.stack || error.toString());
      }

      if (debug.enabled) {
        debug(`Connected to server (${socketPath})`);
      }
    });
    this.ipc.on("error", error => {
      console.error(error.stack || error.toString());
    });
    this.ipc.on("/built", data => {
      this.lastHash = data.hash;

      if (this.isUpToDate()) {
        if (debug.enabled) {
          debug(`Up to date, hash ${data.hash}`);
        }

        return;
      }

      const status = hot.status();

      if (status === "idle") {
        this.check();
      } else if (status === "abort" || status === "fail") {
        console.warn(`[HMR] Cannot apply update as a previous update ${status}ed. Need to do a full reload!`);
      } else if (debug.enabled) {
        debug(`Cannot check changes, status ${status}`);
      }
    });
  }

  isUpToDate() {
    return this.lastHash === this.currentHashGetter();
  }

  check() {
    this.hot.check(true).then(outdatedModules => {
      if (outdatedModules == null) {
        console.warn(`[HMR] Cannot find update. Need to do a full reload!`);
        console.warn(`[HMR] (Probably because of restarting the webpack-dev-server)`);
        return;
      }

      require("webpack/hot/log-apply-result")(outdatedModules, outdatedModules);

      if (this.isUpToDate()) {
        console.log(`[HMR] App is up to date.`);
      }
    }).catch(error => {
      const status = this.hot.status();

      if (status === "abort" || status === "fail") {
        console.warn(`[HMR] ${error.stack || error.toString()}`);
        console.warn("[HMR] Cannot apply update. Need to do a full reload - application will be restarted");

        require("electron").app.exit(100);
      } else {
        console.warn(`[HMR] Update failed: ${error.stack || error.message}`);
      }
    });
  }

} exports.HmrClient = HmrClient;
// __ts-babel@6.0.4
//# sourceMappingURL=HmrClient.js.map