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
var directory;
var sel;
var speed=1;
var frameMil=16.67;
var speedHandler;
var showHitbox=true;
var combos;
var dropdownIndex=[];
var generated=false;
var p1Port=0;
var p2Port=1;
fs.readFile('setup.txt', 'utf8', function(err, data){ 
	fileDir=data;
});
var slpFileList;
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
	sel=createSelect();
	sel.style('display','none');
}
function updateDir(){
	fs.writeFile("setup.txt",document.getElementById("newDir").value,function(err){
		if(err){
			return console.log(err);
		}
		showDir();
	});
}
function toggleHitbox(){
	if(showHitbox){
		showHitbox=false;
	}
	else{
		showHitbox=true;
	}
}
function updateSpeed(){
	speed=parseFloat(document.getElementById('speed').value);
	frameRate(60*speed);
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
function restartSelection(){
	var showStuff=select('#init');
	showStuff.style('display','block');
	sel.style('display','block');
}
function selectionPage(){
	var showStuff=select('#init');
	showStuff.style('display','block');
	readTheDir();
	sel.style('display','block');
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
function makeOption(textStr){
	var thisSelect=document.getElementById("comboDropdown");
	var newOption=document.createElement("option");
	newOption.text=textStr;
	thisSelect.add(newOption);
}
function submitCombos(){
	var hideIt=select('#comboPick');
	hideIt.style('display','none');
	hideIt=select('#unhide');
	hideIt.style('display','block');
	var curSel=document.getElementById("comboDropdown");
	currentFrame=combos[dropdownIndex[curSel.selectedIndex]].startFrame;
	lastFrame=combos[dropdownIndex[curSel.selectedIndex]].endFrame;
	play();
	pause();
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
	sel.style('display','none');
	directory=fileDir;
	directory+="/";
	directory+=sel.value();
	game = new SlippiGame(directory);
	frames=game.getFrames();
	settings=game.getSettings();
	stage=settings.stageId;
	stats=game.getStats();
	lastFrame=stats.lastFrame;
	combos=game.comboComputer.combos;
	starting=true;
	p1Port=settings.players[0].port;
	p1Port--;
	p2Port=settings.players[1].port;
	p2Port--;
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
	p1Char=charCheck(frames[0].players[p1Port].post.internalCharacterId);
	p2Char=charCheck(frames[0].players[p2Port].post.internalCharacterId);
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
	rect(360,310,50,5);
	rect(510,310,50,5);
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
function comboPage(){
	pause();
	fill(255);
	rect(0,0,2000,2000);
	var hideStuff=select('#unhide');
	hideStuff.style('display','none');
	hideStuff=select('#play');
	hideStuff.style('display','none');
	if(!generated){
		hideStuff=select('#combos');
		hideStuff.style('display','block');
		generated=true;
	}
	else{
		filterCombos();
	}
}
function filterCombos(){
	var hideStuff=select('#combos');
	hideStuff.style('display','none');
	if(dropdownIndex==0){
	var minPercent=parseInt(document.getElementById("percent").value);
	var ports;
	if(document.getElementById("port1").checked){
		if(document.getElementById("port2").checked){
			ports=2;
		}
		else{
			ports=0;
		}
	}
	else{
		ports=1;
	}
	var didKill=document.getElementById("didKill").checked;
	var moveCount=parseInt(document.getElementById("minMoves").value);
	var i=0;
	var percentDone;
	var textSend;
	var roundedPercent;
	console.log(didKill+" "+ports+" "+minPercent+" "+moveCount);
	for(i=0;i<combos.length;i++){
		percentDone=combos[i].endPercent;
		percentDone-=combos[i].startPercent;
		roundedPercent=Math.floor(percentDone);
		textSend="Performed by player ";
		textSend+=combos[i].playerIndex+1;
		textSend+=", Starting Frame: "
		textSend+=combos[i].startFrame;
		textSend+=", Ending Frame: ";
		textSend+=combos[i].endFrame;
		textSend+=", Length: ";
		textSend+=combos[i].moves.length;
		textSend+=", Percent Done: ";
		textSend+=roundedPercent;
		if(didKill){
			console.log(didKill);
			if(combos[i].didKill&&combos[i].moves.length>=moveCount&&percentDone>=minPercent){
				if(ports==combos[i].playerIndex||ports==2){
					makeOption(textSend);
					dropdownIndex.push(i);
				}
			}
		}
		else{
			if(combos[i].moves.length>=moveCount&&percentDone>=minPercent){
				console.log("huh");
				if(ports==combos[i].playerIndex||ports==2){
					makeOption(textSend);
					dropdownIndex.push(i);
				}
			}
		}
	}
	}
	var unhideItNow=select('#comboPick');
	unhideItNow.style('display','block');
	fill(255);
	noStroke();
	square(0,0,2000);
}
function players(){
	var stockAdd=((addX*2)/3)-20;
	var stockAdd1=(((addX*2)/3)*2)-20;
	textSize(20);
	fill(255,0,0);
	p1();
	p1State=frames[currentFrame].players[p1Port].post.actionStateId;
	p2State=frames[currentFrame].players[p2Port].post.actionStateId;
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
	if(showHitbox){
		attackState(frames[currentFrame].players[p1Port].post.actionStateId,0);
		attackState(frames[currentFrame].players[p2Port].post.actionStateId,1);
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
	p1X=frames[currentFrame].players[p1Port].post.positionX*2;
	p1X+=addX;
	p1Y=frames[currentFrame].players[p1Port].post.positionY*-2;
	p1Y+=addY;
	p1Y-=22.5;
	p2X=frames[currentFrame].players[p2Port].post.positionX*2;
	p2X+=addX;
	p2Y=frames[currentFrame].players[p2Port].post.positionY*-2;
	p2Y+=addY;
	p2Y-=22.5;
	players();
	
}
function frameAdvance(){
	currentFrame++;
	frameTIme=millis();
	percent1=Math.floor(frames[currentFrame].players[p1Port].post.percent);
	percent1+="%";
	percent2=Math.floor(frames[currentFrame].players[p2Port].post.percent);
	percent2+="%";
	p1Stocks=frames[currentFrame].players[p1Port].post.stocksRemaining;
	p2Stocks=frames[currentFrame].players[p2Port].post.stocksRemaining;
	switch(frames[currentFrame].players[p1Port].post.actionStateId){
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
		switch(frames[currentFrame].players[p2Port].post.actionStateId){
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
	var unhideIt=select('#unhide');
	unhideIt.style('display','none');
	var playButton=select('#play');
	playButton.style('display','none');
	var hideIt=select('#init');
	hideIt.style('display','none');
	resizeCanvas(0,0);
	selectionPage();
	directory=fileDir;
}
function attackState(curState,player){
	switch(curState){
		case 44: //jab 1
			drawHitbox(player,1);
			break;
		case 45: //jab 2
			drawHitbox(player,1);
			break;
		case 46: //jab 3
			drawHitbox(player,1);
			break;
		case 47: //start of rapid jab
			drawHitbox(player,1);
			break;
		case 48: //middle of rapid jab
			drawHitbox(player,1);
			break;
		case 49: //end of rapid jab
			drawHitbox(player,1);
			break;
		case 50: //da
			drawHitbox(player,1);
			break;
		case 51: //uaft
			drawHitbox(player,6);
			break;
		case 52: //high mid ftilt
			drawHitbox(player,6); //it's the same as high ftilt but idc
			break;
		case 53: //mid ftilt
			drawHitbox(player,1);
			break;
		case 54: //low mid ftilt
			drawHitbox(player,4);
			break;
		case 55: //low ftilt
			drawHitbox(player,4);
			break;
		case 56: //uptilt
			drawHitbox(player,2);
			break;
		case 57: //downtilt
			drawHitbox(player,3);
			drawHitbox(player,4);
			break;
		case 58: //fsmash
			drawHitbox(player,1);
			break;
		case 59: //fsmash
			drawHitbox(player,1);
			break;
		case 60: //fsmash
			drawHitbox(player,1);
			break;
		case 61: //fsmash
			drawHitbox(player,1);
			break;
		case 62: //fsmash
			drawHitbox(player,1);
			break;
		case 63: //upsmash
			drawHitbox(player,0);
			drawHitbox(player,8);
			break;
		case 64: //downsmash
			drawHitbox(player,4);
			drawHitbox(player,3);
			drawHitbox(player,5);
		case 65: //nair
			drawHitbox(player,0);
			break;
		case 66: //fair
			drawHitbox(player,1);
			break;
		case 67: //bair
			drawHitbox(player,2);
			break;
		case 68: //uair
			drawHitbox(player,8);
			break;
		case 69: //nice, also dair
			drawHitbox(player,3);
			break;
	}
}
function drawHitbox(player,side){
	if(player===0){//p1
		hitbox(side,p1X,p1Y,frames[currentFrame].players[p1Port].post.facingDirection);
	}
	else if(player===1){//p2
		hitbox(side,p2X,p2Y,frames[currentFrame].players[p2Port].post.facingDirection);
	}
}
function hitbox(side,startX,startY,facing){
	fill(255,170,170);
	noStroke();
	startX-=Math.sqrt(253.125);
	startY-=Math.sqrt(253.125);
	var addNum=22.5;
	addNum*=facing;
	switch(side){
		case 0: //inside
			break;
		case 1: //forward
			startX+=addNum;
			break;
		case 2: //backward
			startX-=addNum;
			break;
		case 3: //down
			startY+=22.5;
			break;
		case 4: //forward and down
			startX+=addNum;
			startY+=22.5;
			break;
		case 5: //backward and down
			startX-=addNum;
			startY+=22.5;
			break;
		case 6: //forward and up
			startX+=addNum;
			startY-=22.5;
			break;
		case 7: //backward and up
			startX-=addNum;
			startY-=22.5;
			break;
		case 8: //up
			startY-=22.5;
			break;
	}
	square(startX,startY,22.5);
}
function draw(){
	frameMil=16.67/speed;
	if(starting){
		firstFrame();
		if(currentFrame<lastFrame&&playing){
			if(millis()-frameTime>=frameMil){
				frameAdvance();
			}
		}
	}
}