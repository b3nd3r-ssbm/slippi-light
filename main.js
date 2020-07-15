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
	switch(stage){
		case 2:
			createCanvas(795,698);
			addX=397.5;
			addY=405;
			break;
		case 3:
			createCanvas(920,582);
			addX=460;
			addY=360;
			break;
		case 8:
			createCanvas(699,518);
			addX=351.4;
			addY=336;
			break;
		case 28:
			createCanvas(1020,746);
			addX=510;
			addY=500;
			break;
		case 31:
			createCanvas(896,616);
			addX=448;
			addY=400;
			break;
		case 32:
			createCanvas(984,656);
			addX=492;
			addY=376;
			break;
	}
	stages();
	var hideIt=select('.toBeHidden');
	hideIt.style('display', 'none');
	var unhideIt=select('#unhide');
	unhideIt.style('display','block');
	firstFrame();
}
function stages(){
	switch(stage){
		case 2:
			fod();
			break;
		case 3:
			ps();
			break;
		case 8:
			ys();
			break;
		case 28:
			dl();
			break;
		case 31:
			bf();
			break;
		case 32:
			fd();
			break;
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
	stroke(0);
	strokeWeight(1);
	fill(255);
	rect(0,0,919,581);
	fill(0);
	noStroke();
	rect(284.5, addY, 351,10);
	rect(350,335,30,5);
	rect(570,335,30,5);
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
	var stockAdd=((addX*2)/3)-20;
	var stockAdd1=(((addX*2)/3)*2)-20;
	textSize(32);
	fill(255,0,0);
	p1();
	var canvasHeight=Number(document.getElementsByTagName("CANVAS")[0].getAttribute("style").substring(22,25));
	text(percent1,stockAdd+20,canvasHeight-50);
	for(var i=0;i<p1Stocks;i++){
		stockAdd+=20;
		circle(stockAdd,canvasHeight-30,15);
	}
	fill(0,0,255);
	p2();
	text(percent2,stockAdd1+20,canvasHeight-50);
	for(var j=0;j<p2Stocks;j++){
		stockAdd1+=20;
		circle(stockAdd1,canvasHeight-30,15);
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
function pause(){
	playing=false;
	var hideIt=select('#pause');
	hideIt.style('display','none');
	var showIt=select('#play');
	showIt.style('display','block');
}
function play(){
	playing=true;
	var hideIt=select('#play');
	hideIt.style('display','none');
	var showIt=select('#pause');
	showIt.style('display','block');
}
function keyTyped(){
	if(key===' '){
		if(playing){
			pause();
		}
		else{
			play();
		}
	}
}
function keyPressed(){
	if(keyCode===RIGHT_ARROW){
		currentFrame+=300;
		firstFrame();
		if(currentFrame>lastFrame){
			currentFrame=lastFrame;
		}
	}
	else if(keyCode===LEFT_ARROW){
		currentFrame-=300;
		firstFrame();
		if(currentFrame<-123){
			currentFrame=-123;
		}
	}
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

