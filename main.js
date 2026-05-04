// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 700,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0d1117',
    show: false,
  });

  win.loadFile('index.html');
  win.once('ready-to-show', () => win.show());
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Get list of test files
ipcMain.handle('get-test-files', () => {
  const dir = __dirname;
  const files = fs.readdirSync(dir).filter(f => f.match(/^TestCase\d+\.js$/i));
  files.sort((a, b) => {
    const na = parseInt(a.match(/\d+/)[0]);
    const nb = parseInt(b.match(/\d+/)[0]);
    return na - nb;
  });
  return files;
});

// Run a single test file
ipcMain.handle('run-test', async (event, filename) => {
  return new Promise((resolve) => {
    const filePath = path.join(__dirname, filename);
    const logs = [];
    let passed = false;

    const proc = spawn(process.execPath, [filePath], {
      env: {
        ...process.env,
        // Ensure Playwright can find its browsers
        PLAYWRIGHT_BROWSERS_PATH: path.join(__dirname, 'node_modules', 'playwright', '.local-browsers'),
      },
      timeout: 60000,
    });

    proc.stdout.on('data', (data) => {
      const text = data.toString();
      logs.push({ stream: 'stdout', text });
      event.sender.send('test-log', { filename, stream: 'stdout', text });
    });

    proc.stderr.on('data', (data) => {
      const text = data.toString();
      logs.push({ stream: 'stderr', text });
      event.sender.send('test-log', { filename, stream: 'stderr', text });
    });

    proc.on('close', (code) => {
      const allLogs = logs.map(l => l.text).join('');
      // Check for pass/fail markers in output
      const hasFailure = allLogs.includes('❌') || allLogs.includes('One or more checks failed');
      const hasSuccess = allLogs.includes('✅ All checks passed');
      passed = hasSuccess && !hasFailure;
      resolve({ filename, passed, code, logs });
    });

    proc.on('error', (err) => {
      event.sender.send('test-log', { filename, stream: 'stderr', text: `Process error: ${err.message}\n` });
      resolve({ filename, passed: false, code: -1, logs });
    });
  });
});