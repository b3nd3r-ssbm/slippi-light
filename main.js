const { app, BrowserWindow } = require('electron')
app.on('ready',function(){
	let win = new BrowserWindow({ show: false })
	win.loadURL(`file://${__dirname}/index.html`)
	win.once('ready-to-show', () => {
	  win.show()
	})
});
const { ipcMain } = require('electron')

ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: filePath,
    icon: '/path/to/icon.png'
  })
})

function load(){
	const { default: SlippiGame } = require('slp-parser-js');
	const game = new SlippiGame(FilePath);
	const frames=game.getFrames();
};