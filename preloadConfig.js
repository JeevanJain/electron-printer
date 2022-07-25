const {
    ipcRenderer,
    contextBridge
} = require("electron");

contextBridge.exposeInMainWorld("api", {
    getAllPrinters: () => {
        console.log("called getAllPrinters preloadConfig.js")
        return ipcRenderer.invoke("getAllPrinters");
    },
    setPrinter: (printer) => {
        console.log("called setPrinter preloadConfig.js", printer)
        return ipcRenderer.invoke("setPrinter", printer);
    }
});
