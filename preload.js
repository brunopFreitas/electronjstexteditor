const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (data) => ipcRenderer.send('saveFile', data),
  saveFileAs: (divContent) => ipcRenderer.send('saveFileAs', divContent)
})