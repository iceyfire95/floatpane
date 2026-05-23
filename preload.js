const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  close:    () => ipcRenderer.send('close-window'),
  minimize: () => ipcRenderer.send('minimize-window'),
  maximize: () => ipcRenderer.send('maximize-window'),

  // Always-on-top — returns a promise resolving to the new state
  toggleAlwaysOnTop: (value) => ipcRenderer.invoke('toggle-always-on-top', value),

  // Window opacity (0–1)
  setOpacity: (value) => ipcRenderer.send('set-opacity', value),

  // Callbacks pushed from the main process
  onWindowFocus:  (cb) => ipcRenderer.on('window-focus-change', (_e, v) => cb(v)),
  onMouseInWindow:(cb) => ipcRenderer.on('mouse-in-window',     (_e, v) => cb(v)),
});
