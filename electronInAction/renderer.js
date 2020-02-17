const { ipcRenderer } = require('electron');

console.log(ipcRenderer.sendSync('sync-message', 'ping'));

ipcRenderer.on('async-reply', (event, arg) => {
  console.log(arg);
})

ipcRenderer.send('async-message', 'async-ping');

ipcRenderer.invoke('invoke-channel', 'invoke-channel-arg').then((res) => {
  console.log(res);
})