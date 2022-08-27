const electron = require('electron')
const {electron2, Menu} = require('electron')
//const hotkeys = require('hotkeys-js')


// const ioHook = require('iohook');
//electron2}.webFrame.setVisualZoomLevelLimits(1,10)
// electron.remote
const url = require('url')
const path = require('path');
const { exit } = require('process');

const {app,BrowserWindow} = electron;

let mainWindow;

var nnData = null;



function createWindow(){
    mainWindow = new BrowserWindow({
        width:1280, height:720
        ,webPreferences: {
            devTools: true
         }
    });
    mainWindow.webContents.setVisualZoomLevelLimits(1,10)
    mainWindow.loadFile("loadData.html")
}

function changeToNN(){
    console.log(nnData)
    mainWindow.loadFile("index.html")
}


app.whenReady().then(
    function() {
       
        createWindow()
        const template=[
            {
                label: "restart",
                click: function(){app.relaunch()
                    app.exit()}
            },
            {
                label: "exit",
                click: function(){exit()}
            },
           {
               label: "back",
               click: function(){
                //    history.back()
                mainWindow.webContents.session.clearCache(function(){
                    //some callback.
                    });
                mainWindow.webContents.goBack()
                }
           }         
        ]
        const menu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(menu)
    }
)