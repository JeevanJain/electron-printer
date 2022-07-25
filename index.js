const { app, BrowserWindow, ipcMain, webContents } = require('electron')
const path = require('path')
const electronStore = require('electron-store');

const storage = new electronStore({ name: 'printerSel' });
global.sharedObj = {
    billPrint: null
};

let mainWin,
    selectionWin;

const createWindow = () => {
    // Create the browser window.
    mainWin = new BrowserWindow({
        width: 800,
        height: 600,
        center: true,
        webPreferences: {
            webviewTag: true,
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    // mainWin.loadFile('index.html')
    mainWin.loadURL('https://obaps.in/crusher_login.php');

    // Open the DevTools.
    mainWin.webContents.openDevTools()

    mainWin.webContents.session.on("select-serial-port", (event, ports, webContents, callback) => {

        console.log("select serial port")
        if (ports && ports.length > 0) {
            console.log("port list is not empty", ports);
        } else {
            console.log("port list is empty");
            callback('');
        }
    });
}

const createSelectWindow = () => {
    console.log("select window")
    // Create the browser window.
    selectionWin = new BrowserWindow({
        frame: false,
        width: 600,
        height: 800,
        backgroundColor: '#fff',
        show: false,
        center: true,
        webPreferences: {
            preload: path.join(__dirname, 'preloadConfig.js')
        }
    });
    selectionWin.loadFile('config.html');
    selectionWin.setMenu(null)

    // selectionWin.webContents.openDevTools()

    selectionWin.once('ready-to-show', () => {
        selectionWin.show()
    })
    selectionWin.on('closed', () => {
        selectionWin = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    if (!storage.has('billPrinter'))
        createSelectWindow();
    else {
        sharedObj.billPrint = storage.get('billPrinter');
        createWindow();
    }

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('getAllPrinters', () => {
    return selectionWin.webContents.getPrintersAsync();
});
ipcMain.handle('setPrinter', (event, printer) => {
    if (selectionWin) {
        storage.set('billPrinter', printer);
        sharedObj.billPrint = printer;
        selectionWin.close();
        createWindow();
    }
});
ipcMain.on("print-message", (event, args) => {
    BrowserWindow.getFocusedWindow().webContents.print({ silent: true, printBackground: false, deviceName: sharedObj.billPrint }, (success) => {
        if (success) {
            if (!BrowserWindow.getFocusedWindow().isDestroyed()) {
                BrowserWindow.getFocusedWindow().close();
            }
        }
    });
})