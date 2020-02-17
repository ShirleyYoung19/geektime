const { app } = require('electron');
const hanldeIPC = require('./ipc');
// const { create: createMainWindow } = require('./window/main');
const { create: createClientWindow } = require('./window/control');

app.on('ready', () => {
  createClientWindow();
  // hanldeIPC();
})