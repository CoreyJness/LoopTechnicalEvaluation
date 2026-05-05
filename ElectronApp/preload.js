// preload.js — Secure IPC bridge
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  runTest: (id, file) => {
    ipcRenderer.send('run-test', { id, file });
  },
  onTestOutput: (cb) => {
    // Remove old listener before adding new one to avoid stacking
    ipcRenderer.removeAllListeners('test-output');
    ipcRenderer.on('test-output', (_event, data) => cb(data));
  },
  onTestDone: (cb) => {
    ipcRenderer.removeAllListeners('test-done');
    ipcRenderer.on('test-done', (_event, data) => cb(data));
  },
});