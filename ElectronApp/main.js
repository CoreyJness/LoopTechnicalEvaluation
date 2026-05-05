// main.js — Electron main process
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 860,
    minWidth: 700,
    minHeight: 600,
    backgroundColor: '#0e0e10',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Run a test script, stream stdout/stderr back, report exit code
ipcMain.on('run-test', (event, { id, file }) => {
  const scriptPath = path.join(__dirname, file);
  console.log(`[main] Spawning: node ${scriptPath}`);

  const child = spawn('node', [scriptPath], {
    cwd: __dirname,
    env: { ...process.env }
  });

  child.stdout.on('data', (data) => {
    const text = data.toString();
    console.log(`[${id}] stdout:`, text);
    event.sender.send('test-output', { id, text });
  });

  child.stderr.on('data', (data) => {
    const text = data.toString();
    console.error(`[${id}] stderr:`, text);
    event.sender.send('test-output', { id, text });
  });

  child.on('close', (code) => {
    console.log(`[${id}] exited with code ${code}`);
    event.sender.send('test-done', { id, passed: code === 0 });
  });

  child.on('error', (err) => {
    console.error(`[${id}] spawn error:`, err);
    event.sender.send('test-output', { id, text: `ERROR: ${err.message}\n` });
    event.sender.send('test-done', { id, passed: false });
  });
});