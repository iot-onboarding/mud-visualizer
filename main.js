const electron = require('electron');
const url = require('url');
const path = require('path');
// const d3 = require('d3');
var fs = require('fs');


// library to read the json files from URLs
const https = require('https');
//library to prompt the text input for the URLs
const prompt = require('electron-prompt');


const { dialog, app, BrowserWindow, Menu} = electron; 
let mainWindow; 


var json_data_loaded = false;
// Listen for app to be ready 
app.on('ready', function () {

    //create new window 
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
        }
    });
    mainWindow.setIcon(path.join(__dirname, 'img/other_icons/icon.png'));
    // mainWindow.maximize()

    // openninng dev tools 
    // mainWindow.openDevTools();

    // load html in window 
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Quit app when closed
    mainWindow.on('closed', function () {
        app.quit();
    })

    // on resize: get the size and send it to the renderer process in case it's needed there
    mainWindow.on('resize', function () {
        var size = mainWindow.getSize();
        var width = size[0];
        var height = size[1];
        if (json_data_loaded) {
            mainWindow.webContents.send('resize', 'resize')
        }
    });

    //build menu from tempalte defined below
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // insert menu 
    Menu.setApplicationMenu(mainMenu);

});

// create menu tempalte 
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open Mud File',
                accelerator: process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
                click() {
                    var files_data = {};
                    dialog.showOpenDialog({properties: ["multiSelections", "openFile"]}, (fileNames) => {
                        // fileNames is an array that contains all the selected
                        if (fileNames === undefined) {
                            console.log("No file selected");
                            return;
                        }

                        for (var file_idx in fileNames) {
                            var filepath = fileNames[file_idx];
                            // fs.readFile(filepath, 'utf-8', (err, data) => {
                            //     if(err){
                            //         alert("An error ocurred reading the file :" + err.message);
                            //         return;
                            //     }
                            //     global.sharedObj= data; 
                            //     mainWindow.webContents.send('draw', 'draw');
                            // });
                            var data = fs.readFileSync(filepath, 'utf-8');
                            files_data[file_idx] = data;
                        }
                        global.sharedObj = JSON.stringify(files_data);
                        mainWindow.webContents.send('draw', 'draw');
                    });
                    json_data_loaded = true;
                }
            },
            {
                label: 'Open MUD-URL',
                accelerator: process.platform == 'darwin' ? 'Command+Shift+O' : 'Ctrl+Shift+O',
                click(){
                    //prompt URL of the MUD file
                    prompt({
                        title: 'Insert the MUD file URL',
                        label: 'URL:',
                        value: 'https://example.com/mud_file.json',
                        inputAttrs: {
                            type: 'url'
                        },
                        type: 'input'
                    })
                    .then((r) => {
                        if(r === null) {
                            console.log('No URL inserted');
                        } else {

                            // collect the data using https
                            var data = "";
                            var test = https.get(r,{}, function(response){
                                response.on('data', (append) => {
                                    data += append;
                                });

                                response.on('end', () => {
                                    // when collect ends, show the result on the screen
                                    addDevicesOnScreen({data});
                                });
                            });
                        }
                    })
                    .catch(console.error);
                }
            },
            {   // label and shortcut for quititng the application
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: "Run",
        submenu: [
            {   // shortcut and label for resetting the application
                label: "Reset",
                accelerator: process.platform == 'darwin' ? 'Command+R' : 'Ctrl+R',
                click() {
                    mainWindow.reload();
                }
            }
        ]
    },
    {   // help menu duh (what's About shortcut btw?) 
        label: "Help",
        submenu: [
            {
                label: "About",
                // accelerator: process.platform == 'darwin' ? 'Command+H' : 'Ctrl+H',
                click() {
                    openAboutWindow();
                }
            }
        ]
    }
];


let aboutWindow;

function openAboutWindow() {
    //create new window 
    aboutWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }, // hardcoded size for the about window (small) 
        width: 300,
        height: 250,
        title: 'About'
    });
    aboutWindow.setMenu(null);
    // load the local html in window from file
    aboutWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'html/about.html'),
        protocol: 'file:',
        slashes: true
    }));

}

function addDevicesOnScreen(devices_list){

    global.sharedObj = JSON.stringify(devices_list);
    mainWindow.webContents.send('draw', 'draw');   
}
