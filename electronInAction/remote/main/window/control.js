const { BrowserWindow } = require('electron');
let window;

function create () {
  window = new BrowserWindow({
    width: 400,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
    }
  });
  
  window.loadFile('./renderer/pages/control/index.html');
  window.webContents.openDevTools();
}

module.exports = {create};
