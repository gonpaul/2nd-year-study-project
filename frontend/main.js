const { app, BrowserWindow } = require('electron');
const path = require('path');
if (process.platform === 'win32') {
    process.env.PATH = process.env.PATH + ';' + process.cwd();
}
function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        }
    });

    win.loadFile(path.join(__dirname, 'renders', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});