const { ipcMain } = require('electron');
const { create: createControlWindow } = require('./window/control');
const { send: sendMainWindow } = require('./window/main');


function handleIPC () {
  ipcMain.handle('login', () => {
    return Math.floor(Math.random() * 899999 + 100000);
  });

  ipcMain.on('control', (event, remoteCode) => {
    createControlWindow();
    sendMainWindow('handle-remote-change', remoteCode, 1);
  })
}

module.exports = handleIPC;
