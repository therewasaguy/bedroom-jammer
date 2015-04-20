var chatBox;
var wordCount;
var messageLength;
var divWidth;
var divHeight;
var myEllipse;
var xList = [];
var yList = [];
var mySize = 40;
var eSizes = [];
var myID;

jQuery(document).ready(function () {
	chatBox = document.getElementById('chat_box');
	divWidth = document.getElementById("chatroom").offsetWidth;
	divHeight = document.getElementById("chatroom").offsetHeight;

	var log_chat_message = function  (message, type) {
		var li = jQuery('<li />').text(message);
		
		if (type === 'system') {
			li.css({'font-weight': 'bold'});
		} else if (type === 'leave') {
			li.css({'font-weight': 'bold', 'color': '#F00'});
		}
				
		jQuery('#chat_log').append(li);
	};

	var socket = io.connect('http://localhost:8080');

	socket.on('entrance', function  (data) {
		log_chat_message(data.message, 'system');
		myID = data.id;
		console.log("my id " + myID);

	});


	socket.on('exit', function  (data) {
		log_chat_message(data.message, 'leave');
	});

	socket.on('chat', function  (data) {
		log_chat_message(data.message, 'normal');
		wordCount = data.message.split(' ');
		messageLength = wordCount.length - 1;
		speaker.speak(messageLength);
	});


	jQuery('#chat_box').keypress(function (event) {
		if (event.which == 13) {
			socket.emit('chat', {message: jQuery('#chat_box').val()});
			speaker.speak(messageLength);
			mySize += 10;
			socket.emit('sendSize', {id:myID, size:mySize});
			jQuery('#chat_box').val('');

		}
	});
});

var SynthSpeak = function(){

	this.synth = new Tone.MonoSynth().toMaster();
	this.synth.volume.value = -14;
	this.sentence;
	this.wordCount;
}

SynthSpeak.prototype._word = function() {
	this.synth.triggerAttackRelease(Tone.prototype.midiToNote(Math.floor(Math.random() * 50 + 26)), .3);
	this.synth.frequency.rampTo(Math.floor(Math.random() * 150 + 20), .3);
}

SynthSpeak.prototype.speak = function(wordcount) {
	this.wordCount = wordcount;

	for (var i = 1; i <= this.wordCount; i++) {
		var random = Math.random();
		var mapped = Math.random() * 75 + 200;
		setTimeout(this._word.bind(this), i * mapped);
	}
}

var speaker = new SynthSpeak();
// var myX,
// 	myY,
// 	myR,
// 	myG,
// 	myB,
// 	meX,
// 	meY;


// var setup = function(){
// 	myCanvas = createCanvas(divWidth,divHeight);
// 	myCanvas.parent('chatroom');
// 	myX = random(50,divWidth - 50);
// 	myY = random(50,divHeight - 50);
// 	noStroke();
// 	myR = random(0,255);
// 	myG = random(0,255);
// 	myB = random(0,255);
// 	meX = random(50,divWidth - 50);
// 	meY = random(50,divHeight - 50);
// 	imageMode(CENTER)
// }

// var preload = function(){
// 	bg = loadImage("./assets/background.png");
// 	guy = loadImage("./assets/dude.png");
// }


// var draw = function(){
// 	background(0);
// 	image(bg, width/2, height/2, width, height);
// 	image(guy, mouse)
// }
