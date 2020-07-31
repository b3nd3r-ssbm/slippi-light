const { app, BrowserWindow } = require('electron');
const { default: SlippiGame } = require('@slippi/slippi-js');
const fs=require('fs');
//const { autoUpdater } = require('electron-updater');
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
var p1Rad=55;
var p2Rad=55;
var percent1="0%";
var percent2="0%";
var p1Stocks=4;
var p2Stocks=4;
var p1Char;
var p2Char;
var canvasHeight;
var canvasWidth;
var actionStates;
var showAction=true;
var p1State;
var p2State;
var prefix;
var fileDir;
fs.readFile('setup.txt', 'utf8', function(err, data){ 
	fileDir=data;
});
var slpFileList;
var sel;
//autoUpdater.checkForUpdatesAndNotify();
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
	createCanvas(0,0);
}
function updateDir(){
	fs.writeFile("setup.txt",document.getElementById("newDir").value,function(err){
		if(err){
			return console.log(err);
		}
		showDir();
	});
}
function readTheDir(){
	showDir();
	fs.readdir(fileDir,  
  { withFileTypes: true }, 
  (err, files) => { 
  if(err){ 
    console.log(err);
  }
  else { 
    slpFileList=files; 
  } 
}); 
}
function selectionPage(){
	removeElements();
	readTheDir();
	sel=createSelect();
	var i=0;
	var currentFile;
	if(slpFileList!=undefined){
		for(i=0;i<slpFileList.length;i++){
			currentFile=slpFileList[i].name;
			if(currentFile.substring(currentFile.length-4)===".slp"){
				sel.option(currentFile);
			}
		}
	}
}
function showButtons(){
	readTheDir();
	var selection=select('#buttonPage');
	selection.style('display','block');
	selection=select('#fileDir');
	selection.style('display','none');
	selectionPage();
}
function showDir(){
	fs.readFile('setup.txt', 'utf8', function(err, data){ 
		fileDir=data;
		document.getElementById("dirHere").innerHTML=data;		
	});
	}
function changeDir(){
	var unhide=select('#fileDir');
	unhide.style('display','block');
}
function process(){
	removeElements();
	var directory=fileDir;
	directory+="/";
	directory+=sel.value();
	game = new SlippiGame(directory);
	frames=game.getFrames();
	settings=game.getSettings();
	stage=settings.stageId;
	stats=game.getStats();
	lastFrame=stats.lastFrame;
	starting=true;
	switch(stage){
		case 2:
			canvasHeight=698;
			canvasWidth=795;
			resizeCanvas(795,698);
			addX=397.5;
			addY=405;
			break;
		case 3:
			canvasHeight=582;
			canvasWidth=920;
			resizeCanvas(920,582);
			addX=460;
			addY=360;
			break;
		case 8:
			canvasHeight=518;
			canvasWidth=699;
			resizeCanvas(699,518);
			addX=351.4;
			addY=336;
			break;
		case 28:
			canvasHeight=746;
			canvasWidth=1020;
			resizeCanvas(1020,746);
			addX=510;
			addY=500;
			canvasIndex=23;
			break;
		case 31:
			canvasHeight=616;
			canvasWidth=896;
			resizeCanvas(896,616);
			addX=448;
			addY=400;
			break;
		case 32:
			canvasHeight=656;
			canvasWidth=984;
			resizeCanvas(984,656);
			addX=492;
			addY=376;
			break;
	}
	stages();
	p1Char=charCheck(frames[0].players[0].post.internalCharacterId);
	p2Char=charCheck(frames[0].players[1].post.internalCharacterId);
	var selection=select('#buttonPage');
	selection.style('display','none');
	var unhideIt=select('#unhide');
	unhideIt.style('display','block');
	selection=select('#init');
	selection.style('display','none');
	selection=select('#fileDir');
	selection.style('display','none');
	var xhttp=new XMLHttpRequest();
	xhttp.onreadystatechange=function(){
		if(this.readyState==4&&this.status==200){
			actionStates=this.responseText.split("\n");
		}
	}
	xhttp.open("GET","actionStates.csv",true);
	xhttp.send();
	play();
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
	rect(350,310,30,5);
	rect(570,310,30,5);
}
function fod(){
	stroke(0);
	strokeWeight(1);
	fill(255);
	rect(0,0,794,697);
	noStroke();
	fill(0);
	rect(267.5,405,260,10);
}
function bf(){
	stroke(0);
	strokeWeight(1);
	fill(255);
	rect(0,0,895,615);
	noStroke();
	fill(0);
	rect(311.2,400,273.6,10);
	rect(410.4,291.2,75.2,5);
	rect(332.8,345.6,75.2,5);
	rect(488,345.6,75.2,5);
}
function dl(){
	stroke(0);
	strokeWeight(1);
	fill(255);
	rect(0,0,1019,745);
	noStroke();
	fill(0);
	rect(355.46,499.98,309.08,10);
	rect(471.9624,397.1472,76.0752,5);
	rect(387.2208,439.7156,59.3362,5);
	rect(573.4102,439.515,62.7462,5);
	strokeWeight(1);
	stroke(0);
	line(355.46,499.98,378.478,571.5086);
	line(664.54,499.98,641.522,571.5086);
	line(378.478,571.5086,641.522,571.5086);
	noStroke();
}
function ys(){
	stroke(0);
	strokeWeight(1);
	fill(255);
	rect(0,0,698,517);
	stroke(0);
	strokeWeight(10);
	line(273,336,429.8,336);
	line(273,336,239.4,343);
	line(429.8,336,463.4,343);
	line(456.75,349.3,460.6,430.49);
	line(242.2,349.3,238.35,430.39);
	noStroke();
	fill(0);
	rect(319.9,252,63,5);
	rect(232.4,289.1,63,5);
	rect(407.4,289.1,63,5);
}
function players(){
	var stockAdd=((addX*2)/3)-20;
	var stockAdd1=(((addX*2)/3)*2)-20;
	textSize(20);
	fill(255,0,0);
	p1();
	p1State=frames[currentFrame].players[0].post.actionStateId;
	p2State=frames[currentFrame].players[1].post.actionStateId;
	prefix="P1 Action State: ";
	if(actionStates!=undefined&&showAction){
		text(prefix+actionStates[p1State],0,50);
	}
	prefix="P2 Action State: ";
	text(p1Char,stockAdd+40,canvasHeight-7);
	textSize(32);
	text(percent1,stockAdd+20,canvasHeight-50);
	for(var i=0;i<p1Stocks;i++){
		stockAdd+=20;
		circle(stockAdd+20,canvasHeight-30,15);
	}
	fill(0,0,255);
	p2();
	text(percent2,stockAdd1+20,canvasHeight-50);
	textSize(20);
	if(actionStates!=undefined&&showAction){
		text(prefix+actionStates[p2State],canvasWidth-300,50);
	}
	text(p2Char,stockAdd1+40,canvasHeight-7);
	for(var j=0;j<p2Stocks;j++){
		stockAdd1+=20;
		circle(stockAdd1,canvasHeight-30,15);
	}
}
function p1(){
	circle(p1X,p1Y,p1Rad);
}
function p2(){
	circle(p2X,p2Y,p2Rad);
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
	switch(frames[currentFrame].players[0].post.actionStateId){
		case 4:
			p1Rad-=(55/180);
			break;
		case 7:
			p1Rad=300;
			break;
		case 8:
			p1Rad=300;
			break;
		default:
			p1Rad=55;
	}
		switch(frames[currentFrame].players[1].post.actionStateId){
		case 4:
			p2Rad-=(55/180);
			break;
		case 7:
			p2Rad=300;
			break;
		case 8:
			p2Rad=300;
			break;
		default:
			p2Rad=55;
	}
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
function charCheck(charId){
	switch(charId){
		case 0:
			return "Mario";
			break;
		case 1:
			return "Fox";
			break;
		case 2:
			return "Falcon";
			break;
		case 3:
			return "DK";
			break;
		case 4:
			return "Kirby";
			break;
		case 5:
			return "Bowser";
			break;
		case 6:
			return "Link";
			break;
		case 7:
			return "Sheik";
			break;
		case 8:
			return "Ness";
			break;
		case 9:
			return "Peach";
			break;
		case 10:
			return "Icies";
			break;
		case 12:
			return "Pikachu";
			break;
		case 13:
			return "Samus";
			break;
		case 14:
			return "Yoshi";
			break;
		case 15:
			return "Puff";
			break;
		case 16:
			return "Mewtwo";
			break;
		case 17:
			return "Luigi";
			break;
		case 18:
			return "Marth";
			break;
		case 19:
			return "Zelda";
			break;
		case 20:
			return "Y. Link";
			break;
		case 21:
			return "Dr. Mario";
			break;
		case 22:
			return "Falco";
			break;
		case 23:
			return "Pichu";
			break;
		case 24:
			return "GnW";
			break;
		case 25:
			return "Ganon";
			break;
		case 26:
			return "Roy";
			break;
	}
}
function changeAction(){
	if(showAction===true){
		showAction=false;
	}
	else{
		showAction=true;
	}
}
function restart(){
	page=1;
	pause();
	starting=false;
	currentFrame=-123;
	frameTime=0;
	p1Rad=55;
	p2Rad=55;
	percent1="0%";
	percent2="0%";
	p1Stocks=4;
	p2Stocks=4;
	noStroke();
	fill(255);
	rect(0,0,2000,2000);
	var hideIt=select('.toBeHidden');
	hideIt.style('display', 'block');
	var unhideIt=select('#unhide');
	unhideIt.style('display','none');
	var playButton=select('#play');
	playButton.style('display','none');
	hideIt=select('#init');
	hideIt.style('display','none');
	selectionPage();
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