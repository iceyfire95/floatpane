const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;
let mouseCheckInterval;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 680,
    frame: false,
    alwaysOnTop: true,
    resizable: true,
    minWidth: 380,
    minHeight: 260,
    backgroundColor: '#0d0d14',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
    },
  });

  mainWindow.loadFile('index.html');

  // Relay OS-level window focus state to the renderer
  mainWindow.on('focus', () => {
    if (!mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window-focus-change', true);
    }
  });
  mainWindow.on('blur', () => {
    if (!mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window-focus-change', false);
    }
  });

  // Poll mouse position every 100 ms and tell the renderer whether it's
  // inside the window bounds. The webview captures mouse events so we
  // can't rely on DOM mouseenter/leave inside the renderer.
  mouseCheckInterval = setInterval(() => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    try {
      const cursor = screen.getCursorScreenPoint();
      const bounds = mainWindow.getBounds();
      const inWindow =
        cursor.x >= bounds.x &&
        cursor.x <= bounds.x + bounds.width &&
        cursor.y >= bounds.y &&
        cursor.y <= bounds.y + bounds.height;
      mainWindow.webContents.send('mouse-in-window', inWindow);
    } catch (_) {}
  }, 80);

  mainWindow.on('closed', () => {
    clearInterval(mouseCheckInterval);
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ── IPC handlers ────────────────────────────────────────────────────────────

ipcMain.handle('toggle-always-on-top', (_event, value) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    // 'floating' keeps it above normal windows but below system UI
    mainWindow.setAlwaysOnTop(value, 'floating');
  }
  return value;
});

ipcMain.on('set-opacity', (_event, value) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setOpacity(Math.max(0.1, Math.min(1, parseFloat(value))));
  }
});

ipcMain.on('minimize-window', () => {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.minimize();
});

ipcMain.on('close-window', () => {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.close();
});

ipcMain.on('maximize-window', () => {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
});
