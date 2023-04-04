const {
    app,
    BrowserWindow,
    ipcMain,
    dialog,
    nativeTheme,
    Menu
} = require('electron')
const path = require('path')
const fs = require('fs')

// Electron main process

function createWindow() {
    const mainWindow = new BrowserWindow({
        width:635, 
        height:500,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    nativeTheme.themeSource = 'dark'
    mainWindow.setTitle('Simple Text Editor')
    mainWindow.removeMenu()
    mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
    // Open a file
    ipcMain.handle('dialog:openFile', handleFileOpen)
    // Save a file
    ipcMain.on('saveFile', (event, data) => {
        handleFileSave(data)
      })
    // Save a file As
    ipcMain.on('saveFileAs', (event, divContent) => {
        handleFileSaveAs(divContent)
      })
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// Functions

// Open a file
async function handleFileOpen() {
    const {
        canceled,
        filePaths
    } = await dialog.showOpenDialog({
        title: 'Choose a file',
        defaultPath: '.',
        buttonLabel: 'Choose a file',
        filters: [
            { name: ".txt", extensions: ["txt"] }
          ],
        properties: ['openFile']
    })
    if (canceled) {
        return
    } else {
        const filePath = filePaths[0]
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const data = { filePath, fileContent }
        return data
    }
}

// Save a file
async function handleFileSave(data) {
    if(data.filePath=='') {
        let filename = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
            title: 'Save to File…',
            filters: [
             { name: '.txt', extensions: ['txt'] }
            ]
           });
        if(filename) {
            fs.writeFileSync(filename.filePath, data.divContent)
        }
    } else {
        fs.writeFileSync(data.filePath, data.divContent)
    }
}

// Save a file As
async function handleFileSaveAs(divContent) {
    let filename = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
        title: 'Save to File…',
        filters: [
            { name: '.txt', extensions: ['txt'] }
        ]
        });
    if(filename) {
        fs.writeFileSync(filename.filePath, divContent)
    }
}