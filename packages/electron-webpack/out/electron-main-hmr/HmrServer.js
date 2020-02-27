"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HmrServer = void 0;

function _crocket() {
  const data = _interopRequireDefault(require("crocket"));

  _crocket = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require("debug")("electron-webpack:dev-runner");

class HmrServer {
  constructor() {
    this.state = false;
    this.ipc = new (_crocket().default)();
  }

  listen() {
    return new Promise((resolve, reject) => {
      const socketPath = `/tmp/electron-main-ipc-${process.pid.toString(16)}.sock`;
      this.ipc.listen({
        path: socketPath
      }, error => {
        if (error != null) {
          reject(error);
        }

        if (debug.enabled) {
          debug(`HMR Server listening on ${socketPath}`);
        }

        resolve(socketPath);
      });
    });
  }

  beforeCompile() {
    this.state = false;
  }

  built(stats) {
    this.state = true;
    setImmediate(() => {
      if (!this.state) {
        return;
      }

      const hash = stats.toJson({
        assets: false,
        chunks: false,
        children: false,
        modules: false
      }).hash;

      if (debug.enabled) {
        debug(`Send built: hash ${hash}`);
      }

      this.ipc.emit("/built", {
        hash
      });
    });
  }

} exports.HmrServer = HmrServer;
// __ts-babel@6.0.4
//# sourceMappingURL=HmrServer.js.map