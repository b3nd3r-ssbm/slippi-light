const { app, BrowserWindow } = require('electron');
if(app!== undefined){
	app.on('ready',function(){
		let win = new BrowserWindow({ 
			webPreferences: {
            			nodeIntegration: true
        		}
		});
		win.loadURL(`file://${__dirname}/index.html`);
	});
}
const { ipcMain } = require('electron');

if(ipcMain!==undefined){
	ipcMain.on('ondragstart', (event, filePath) => {
  		event.sender.startDrag({
    			file: filePath,
    			icon: '/path/to/icon.png'
 		 });
		load(filePath);
	});
}

function load(fullFilePath){
	const { default: SlippiGame } = require('slp-parser-js');
	const game = new SlippiGame(fullFilePath);
	const frames=game.getFrames();
	console.log(fullFilePath);
};