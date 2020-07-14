const { app, BrowserWindow } = require('electron');
const { default: SlippiGame } = require('slp-parser-js');
var frames;
var stage;
var starting=false;
var settings;
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
/*function dropHandler(ev) {
	ev.preventDefault();
	const { default: SlippiGame } = require('slp-parser-js');
	const game = new SlippiGame(Buffer.from(ev.dataTransfer.items[0].getAsFile()));
	frames=game.getFrames();
	const settings=game.getSettings();
	stage=settings.stageId;
	starting=true;
	createCanvas(640,528);
	background(0);
}*/
function setup(){
	createCanvas(640,528);
	loop();
	background(0);
}
function process(){
	var game = new SlippiGame(document.getElementById("fileIn").value);
	frames=game.getFrames();
	settings=game.getSettings();
	stage=settings.stageId;
	starting=true;
}
function stages(){
	if(stage===2){
		fod();
	}
	else if(stage===3){
		ps();
	}
	else if(stage===8){
		ys();
	}
	else if(stage===28){
		dl();
	}
	else if(stage===31){
		bf();
	}
	else if(stage===32){
		fd();
	}
}
function fd(){
	
}
function ps(){
	
}
function fod(){
	
}
function bf(){
	
}
function dl(){
	
}
function ys(){
	
}
/*function draw(){
	if(starting===true){
		fill(255,255,255);
		rect(200,200,200,200);
	}
}*/
