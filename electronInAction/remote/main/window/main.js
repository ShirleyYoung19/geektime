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
  
  window.loadURL('http://localhost:3000');
}

function send (channel, ...args) {
  window.webContents.send(channel, ...args);
}

module.exports = { create, send };
