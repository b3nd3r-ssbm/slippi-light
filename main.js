const { app, BrowserWindow } = require('electron')
app.on('ready',function(){
	let win = new BrowserWindow({ show: false })
	win.once('ready-to-show', () => {
	  win.show()
	})
});
function load(){
	const { default: SlippiGame } = require('slp-parser-js');
	const slippiGame=document.getElementById("test").files[0];
	const game = new SlippiGame(Buffer.from(slippiGame));
	const frames=game.getFrames();
};