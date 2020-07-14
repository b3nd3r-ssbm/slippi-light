const { app, BrowserWindow } = require('electron');
const { default: SlippiGame } = require('slp-parser-js');
var frames;
var stage;
var starting=false;
var settings;
var stats;
var lastFrame;
var game;
var currentFrame=-123;
var frameTime=0;
var playing=true;
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
	loop();
}
function process(){
	game = new SlippiGame(document.getElementById("fileIn").value);
	frames=game.getFrames();
	settings=game.getSettings();
	stage=settings.stageId;
	stats=game.getStats();
	lastFrame=stats.lastFrame;
	starting=true;
	stages();
}
function startStages(){
	if(stage===2){
		createCanvas(795,698);
	}
	else if(stage===3){
		createCanvas(920,582);
	}
	else if(stage===8){
		createCanvas(699,518);
	}
	else if(stage===28){
		createCanvas(1020,746);
	}
	else if(stage===31){
		createCanvas(896,616);
	}
	else if(stage===32){
		createCanvas(984,656);
	}
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
function p1(x, y){
	
}
function p2(x, y){
	
}
function frameAdvance(){
	
}
function draw(){
	if(starting===true){
		while(currentFrame<lastFrame&&playing){
			if(millis()-frameTime>=16.67){
				frameAdvance();
			}
		}
		fill(0);
		rect(mouseX,mouseY,55,55);
	}
}
