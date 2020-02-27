"use strict";

function _electronDevtoolsInstaller() {
  const data = _interopRequireWildcard(require("electron-devtools-installer"));

  _electronDevtoolsInstaller = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// install vue-devtools
require("electron").app.on("ready", () => {
  (0, _electronDevtoolsInstaller().default)(_electronDevtoolsInstaller().VUEJS_DEVTOOLS).catch(error => {
    console.log("Unable to install `vue-devtools`: \n", error);
  });
}); 
// __ts-babel@6.0.4
//# sourceMappingURL=vue-main-dev-entry.js.map