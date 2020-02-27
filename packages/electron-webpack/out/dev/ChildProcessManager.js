"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.PromiseNotifier = exports.ChildProcessManager = void 0;

function _child_process() {
  const data = require("child_process");

  _child_process = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const debug = require("debug")("electron-webpack");

function run(program, args, options) {
  const isWin = process.platform === "win32";
  return (0, _child_process().spawn)(isWin ? path.join(__dirname, "../../vendor/runnerw.exe") : program, isWin ? [program].concat(args) : args, options);
}

class ChildProcessManager {
  constructor(child, debugLabel, promiseNotifier) {
    // noinspection TypeScriptFieldCanBeMadeReadonly
    this.mainProcessExitCleanupCallback = null;
    this.child = child;

    require("async-exit-hook")(callback => {
      this.mainProcessExitCleanupCallback = callback;
      const child = this.child;

      if (child == null) {
        return;
      }

      this.child = null;

      if (promiseNotifier != null) {
        promiseNotifier.resolve();
      }

      if (debug.enabled) {
        debug(`Send SIGINT to ${debugLabel}`);
      }

      if (process.platform === "win32") {
        child.stdin.end(Buffer.from([5, 5]));
      } else {
        child.kill("SIGINT");
      }
    });

    child.on("close", code => {
      const mainProcessExitCleanupCallback = this.mainProcessExitCleanupCallback;

      if (mainProcessExitCleanupCallback != null) {
        this.mainProcessExitCleanupCallback = null;
        mainProcessExitCleanupCallback();
      }

      const child = this.child;

      if (child == null) {
        return;
      }

      this.child = null;
      const message = `${debugLabel} exited with code ${code}`;

      if (promiseNotifier != null) {
        promiseNotifier.reject(new Error(message));
      }

      if (code === 0) {
        if (debug.enabled) {
          debug(message); // otherwise no newline in the terminal

          process.stderr.write("\n");
        }
      } else {
        process.stderr.write(`${message}\n`);
      }
    });
  }

}

exports.ChildProcessManager = ChildProcessManager;

class PromiseNotifier {
  constructor(_resolve, _reject) {
    this._resolve = _resolve;
    this._reject = _reject;
  }

  resolve() {
    const r = this._resolve;

    if (r != null) {
      this._resolve = null;
      r();
    }
  }

  reject(error) {
    if (this._resolve != null) {
      this._resolve = null;
    }

    const _reject = this._reject;

    if (_reject != null) {
      this._reject = null;

      _reject(error);
    }
  }

} exports.PromiseNotifier = PromiseNotifier;
// __ts-babel@6.0.4
//# sourceMappingURL=ChildProcessManager.js.map