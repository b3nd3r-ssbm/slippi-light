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
var addX;
var addY;
var p1X;
var p1Y;
var p2X;
var p2Y;
var percent1="0%";
var percent2="0%";
var p1Stocks=4;
var p2Stocks=4;
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
	startStages();
	stages();
	var hideIt=select('.toBeHidden');
	hideIt.style('display', 'none');
	var unhideIt=select('#unhide');
	unhideIt.style('display','inline');
	firstFrame();
}
function startStages(){
	if(stage===2){
		createCanvas(795,698);
		addX=397.5;
		addY=405;
	}
	else if(stage===3){
		createCanvas(920,582);
		addX=460;
		addY=360;
	}
	else if(stage===8){
		createCanvas(699,518);
		addX=351.4;
		addY=336;
	}
	else if(stage===28){
		createCanvas(1020,746);
		addX=510;
		addY=500;
	}
	else if(stage===31){
		createCanvas(896,616);
		addX=448;
		addY=400;
	}
	else if(stage===32){
		createCanvas(984,656);
		addX=492;
		addY=376;
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
	stroke(0);
	strokeWeight(1);
	fill(255);
	rect(0,0,983,655);
	fill(0);
	noStroke();
	rect(320.8788, 376, 342.2424,10);
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
function players(){
	var stockAdd=308;
	var stockAdd1=636;
	textSize(32);
	fill(255,0,0);
	p1();
	text(percent1,328,600);
	for(var i=0;i<p1Stocks;i++){
		stockAdd+=20;
		circle(stockAdd,620,15);
	}
	fill(0,0,255);
	p2();
	text(percent2,656,600);
	for(var j=0;j<p2Stocks;j++){
		stockAdd1+=20;
		circle(stockAdd1,620,15);
	}
}
function p1(){
	circle(p1X,p1Y,55);
}
function p2(){
	circle(p2X,p2Y,55);
}
function firstFrame(){
	stages();
	p1X=frames[currentFrame].players[0].post.positionX*2;
	p1X+=addX;
	p1Y=frames[currentFrame].players[0].post.positionY*-2;
	p1Y+=addY;
	p2X=frames[currentFrame].players[1].post.positionX*2;
	p2X+=addX;
	p2Y=frames[currentFrame].players[1].post.positionY*-2;
	p2Y+=addY;
	players();
	
}
function frameAdvance(){
	currentFrame++;
	frameTIme=millis();
	percent1=Math.floor(frames[currentFrame].players[0].post.percent);
	percent1+="%";
	percent2=Math.floor(frames[currentFrame].players[1].post.percent);
	percent2+="%";
	p1Stocks=frames[currentFrame].players[0].post.stocksRemaining;
	p2Stocks=frames[currentFrame].players[1].post.stocksRemaining;
}
function draw(){
	if(starting){
		firstFrame();
		if(currentFrame<lastFrame&&playing){
			if(millis()-frameTime>=16.67){
				frameAdvance();
			}
		}
	}
}
