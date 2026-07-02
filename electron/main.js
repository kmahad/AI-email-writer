const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

const isDev = process.env.NODE_ENV !== 'production';
const BACKEND_PORT = 3001;
const FRONTEND_DEV_URL = 'http://localhost:5173';

function startBackend() {
  const backendPath = path.join(__dirname, '..', 'backend', 'server.js');

  backendProcess = spawn('node', [backendPath], {
    cwd: path.join(__dirname, '..', 'backend'),
    env: { ...process.env, PORT: BACKEND_PORT.toString() },
    stdio: 'pipe',
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`[Backend] ${data.toString().trim()}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`[Backend Error] ${data.toString().trim()}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`[Backend] Process exited with code ${code}`);
  });

  return new Promise((resolve) => {
    // Wait for the backend to be ready
    const checkBackend = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:${BACKEND_PORT}/api/health`);
        if (response.ok) {
          clearInterval(checkBackend);
          resolve();
        }
      } catch {
        // Backend not ready yet
      }
    }, 500);

    // Timeout after 15 seconds
    setTimeout(() => {
      clearInterval(checkBackend);
      resolve();
    }, 15000);
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 800,
    minHeight: 600,
    title: 'AI Email Writer',
    backgroundColor: '#06060f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    // Frameless for cleaner look (optional — use standard frame for compatibility)
    // frame: false,
    titleBarStyle: 'default',
    show: false,
  });

  // Show window when ready to avoid white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDev) {
    mainWindow.loadURL(FRONTEND_DEV_URL);
  } else {
    // In production, load the built frontend
    mainWindow.loadFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  console.log('Starting backend server...');
  await startBackend();
  console.log('Backend ready. Opening window...');
  await createWindow();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
