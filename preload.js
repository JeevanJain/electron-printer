const {
    ipcRenderer,
    contextBridge
} = require("electron");

contextBridge.exposeInMainWorld("api", {
    printWin: () => {
        ipcRenderer.send("print-message");
    }
});
