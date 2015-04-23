var game = new Phaser.Game(1400, 800, Phaser.AUTO, 'chatroom', {
	preload: preload,
	create: create,
	update: update
});
var socket = io.connect('http://localhost:8080');
var myIndex;
var platforms;

var leafLedges = [];
var leafSprites = [];
var leafContact, prevLeafContact;
var origTint = 0xFFFFFF;

var flower;
var player;
var player2;
var eyes;
var eyesOpen = false;
var apple;
var creature;
var bouncy;
var score = 0;
var scoreText;
var broccoli;
var players;
var direction = -1;
var creatureDirection = 'left';
var playerX,
	playerY,
	playerVel;
var player2;
var existingPlayer;
var otherPlayer;
var player2Exists = false;
var player2Set = false;
var chosenCharacter = Math.floor(Math.random() * 2);

function preload() {
	game.load.image('sky', './assets/sky.png');
	game.load.image('grass', './assets/grass.png');
	game.load.image('diamond', './assets/diamond.png');
	game.load.image('smallgrass', './assets/smallgrass.png');
	game.load.image('smallgrasspatch', './assets/smallgrasspatch.png');
	game.load.image('platform', './assets/platform.png');
	game.load.image('star', './assets/star.png');
	game.load.image('leftleaf', './assets/leftleaf.png');
	game.load.image('rightleaf', './assets/rightleaf.png');
	game.load.image('stem', './assets/stem.png');
	game.load.image('cave', './assets/cave.png');
	game.load.image('cloud', './assets/cloud.png');
	game.load.image('tree', './assets/tree.png');
	game.load.image('apple', './assets/apple.png');
	game.load.image('frontcave', './assets/frontcave.png');
	game.load.image('frontcave', './assets/frontcave.png');
	game.load.image('smallgrass', './assets/smallgrass.png');
	game.load.spritesheet('dude1', './assets/dude1.png', 35, 60);
	game.load.spritesheet('dude2', './assets/dude2.png', 40, 60);
	game.load.spritesheet('broccoli', './assets/broccoli.png', 200, 220);
	game.load.spritesheet('flower', './assets/flower.png', 220, 220);
	game.load.spritesheet('eyes', './assets/eyes.png', 70, 25);
	game.load.spritesheet('baddie', './assets/baddie.png', 32, 32);
	game.load.spritesheet('bouncy', './assets/bouncycreature.png', 220, 200);
}



function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

	platforms = game.add.group();
	platforms.enableBody = true;



	var sky = game.add.sprite(0, 0, 'sky');
	// sky.width = w;
	// sky.height = h; 
	var tree = game.add.sprite(15, 125, 'tree');
	tree.scale.setTo(.6, .6);

	eyes = game.add.sprite(115, 160, 'eyes');
	// eyes.enableBody = true;
	// eyes.body.immovable = true;


	var leaf = game.add.sprite(602, game.world.height - 226, 'leftleaf');
	leaf.scale.setTo(.66, .66);
	var ledge = platforms.create(608, game.world.height - 200, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.23, .05);
	leafLedges.push(ledge);
	leafSprites.push(leaf);


	ledge = platforms.create(534, game.world.height - 494, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.23, .05);
	leaf = game.add.sprite(528, game.world.height - 520, 'leftleaf');
	leaf.scale.setTo(.66, .66);
	leafLedges.push(ledge);
	leafSprites.push(leaf);


	ledge = platforms.create(726, game.world.height - 354, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.23, .05);
	leaf = game.add.sprite(720, game.world.height - 380, 'rightleaf');
	leaf.scale.setTo(.66, .66);
	leafLedges.push(ledge);
	leafSprites.push(leaf);



	game.add.sprite(580, 100, 'stem');
	flower = game.add.sprite(580, 10, 'flower');

	broccoli = game.add.sprite(game.world.width - 200, game.world.height - 346, 'broccoli');
	broccoli.enableBody = true;

	broccoli.scale.setTo(.7, .7);
	broccoli.animations.add('on', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
	broccoli.animations.play('on');

	game.add.sprite(game.world.width - 400, game.world.height - 310, 'cave');



	//leafLedges = game.add.group();


	//clouds = game.add.sprite();
	//clouds.enableBody = true;


	var ledge = platforms.create(274, 220, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.44, .5);
	var cloud = game.add.sprite(270, 200, 'cloud');

	var ledge = platforms.create(1200, 180, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.44, .5);
	var leaf = game.add.sprite(1196, 160, 'cloud');

	var ledge = platforms.create(804, 240, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.44, .5);
	var cloud = game.add.sprite(800, 220, 'cloud');

	var ledge = platforms.create(946, 410, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.44, .5);
	var cloud = game.add.sprite(940, 390, 'cloud');



	// var ledge = platforms.create(1100, game.world.height - 400, 'platform');
	// ledge.body.immovable = true;
	// var grass = game.add.sprite(1096, game.world.height - 440, 'smallgrass');
	// grass.scale.setTo(.63, 1);


	var ledge = platforms.create(-80, game.world.height - 400, 'platform');
	ledge.body.immovable = true;
	var grass = game.add.sprite(-320, game.world.height - 440, 'smallgrass');


	var ground = platforms.create(0, game.world.height - 32, 'platform');
	var grass = game.add.sprite(-10, game.world.height - 70, 'grass');

	apple = game.add.sprite(50, 370, 'apple');
	apple.enableBody = true;
	apple.scale.setTo(.7, .7);

	bouncy = game.add.sprite(75, game.world.height - 152, 'bouncy');
	bouncy.enableBody = true;

	bouncy.scale.setTo(.6, .6);

	players = game.add.group();
	players.enableBody = true;

	creature = game.add.sprite(game.world.width - 90, game.world.height - 120, 'baddie');
	if (chosenCharacter === 0) {
		player = players.create(500, game.world.height - 150, 'dude1');
	} else {
		player = players.create(500, game.world.height - 150, 'dude2');
	}

	player2 = players.create(500, game.world.height - 150, 'dude2');
	player2.exists = false;

	game.add.sprite(game.world.width - 400, game.world.height - 310, 'frontcave');
	var grass = game.add.sprite(game.world.width - 130, game.world.height - 70, 'smallgrasspatch');



	grass.scale.setTo(1.1, 1);
	ground.scale.setTo(4, 4);

	ground.body.immovable = true;

	var ledge = platforms.create(game.world.width - 165, game.world.height - 250, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.75, 3.4);


	game.physics.arcade.enable(player);
	game.physics.arcade.enable(apple);
	game.physics.arcade.enable(broccoli);
	game.physics.arcade.enable(creature);
	game.physics.arcade.enable(bouncy);
	player.body.bounce.y = .180;
	player.body.gravity.y = 425;
	creature.body.bounce.y = 0;
	creature.body.gravity.y = 425;
	player.body.collideWorldBounds = true;
	creature.body.collideWorldBounds = true;
	bouncy.body.collideWorldBounds = true;
	bouncy.body.immovable = true;
	player.animations.add('left', [0, 1], 10, true);
	player.animations.add('right', [3, 4], 10, true);
	player.animations.add('blink', [5, 6, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5], 10, true);
	creature.animations.add('left', [0, 1], 10, true);
	creature.animations.add('right', [2, 3], 10, true);
	bouncy.animations.add('on', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10, true);

	//creature.events.onEnterBounds.add( function(){console.log('collision')}, this );
	//creature.checkWorldBounds = true;

	var eyeList = [];
	for (var i = 0; i < 28; i++) {
		eyeList.push(i);
	}

	eyes.animations.add('on', eyeList, 10, true);
	flower.animations.add('on', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 20, true);
	cursors = game.input.keyboard.createCursorKeys();


	stars = game.add.group();
	stars.enableBody = true;


	for (var i = 1; i < 4; i++) {
		var star = stars.create(1215 + i * 40, 200, 'star');
		star.body.velocity.y = i * 100 + 20;
		star.body.gravity.y = 20;
	}



	scoreText = game.add.text(16, 16, 'Arbitrary Score: 0', {
		fontSize: '28px',
		fill: '#000'
	});

	eyes.animations.play('on');
	bouncy.animations.play('on');

	flower.animations.play('on');

	//eyes.frame = 7;

}

function update() {

	leafContact = -1;

	game.physics.arcade.collide(player, eyes);

	game.physics.arcade.collide(player, creature);
	//game.physics.arcade.collide(player, bouncy);
	game.physics.arcade.collide(creature, platforms);
	game.physics.arcade.collide(stars, platforms, function(star) {
		star.kill();
		makeStar()
	});
	game.physics.arcade.overlap(player, stars, collectStar, null, this);
	game.physics.arcade.overlap(player, bouncy, animateBroccoli, null, this);
	if (!appleOn) {
		game.physics.arcade.overlap(player, apple, playApple, null, this);
	}

	// game.physics.arcade.overlap(player, eyes, eyesBlink, null, this);

	game.physics.arcade.overlap(player, platforms, playerOnPlatform, null, this);
	game.physics.arcade.collide(player, platforms);


	// if (creature.position.x < 2 || creature.position.x > 1365){
	// 	turnCreature();
	// }


	creature.body.velocity.x = direction * 150;
	player.body.velocity.x = 0;

	if (cursors.left.isDown) {
		player.body.velocity.x = -150;
		player.animations.play('left');
	} else if (cursors.right.isDown) {
		player.body.velocity.x = 150;
		player.animations.play('right');
	} else {
		player.animations.play('blink');
	}

	if (cursors.down.isDown && cursors.left.isDown) {
		player.body.velocity.y = 800;
		player.animations.play('left');
	} else if (cursors.down.isDown && cursors.right.isDown) {
		player.body.velocity.y = 800;
		player.animations.play('right');
	} else if (cursors.down.isDown && !cursors.up.isDown) {
		player.body.velocity.y = 800;
		player.animations.play('blink');
	}

	if (cursors.up.isDown && player.body.touching.down) {
		player.body.velocity.y = -400;
	}
	//creature.frame = 1;


	creature.animations.play(creatureDirection);

	playerX = player.position.x;
	playerY = player.position.y;
	playerVel = player.body.velocity.x;
	socket.emit('playerPos', {
		x: playerX,
		y: playerY,
		velocity: playerVel,
		index: myIndex
	});

	if (prevLeafContact >= 0 && leafContact === -1) {
		leafOff(prevLeafContact);
	} else {
		leafOn(leafContact);
	}

	prevLeafContact = leafContact;

	playerDistanceFromEyes();
	tintLeaves();
	if (appleOn) {
		apple.position.x = player.position.x;
		apple.position.y = player.position.y;
	} else {
		apple.position.x = 50;
		apple.position.y = 370;
	}

	//cave x > 1253, y > 490
}

// socket.on('updatePos', function(data) {
// 	//console.log(data.x, data.y);
// 	players.children[data.index + 1].position.x = data.x;
// 	players.children[data.index + 1].position.y = data.y;

// })

socket.on('entrance', function(data) {
	socket.emit('getStatus');
});

socket.on('giveStatus', function() {
	playerExists = true;
	socket.emit('respondStatus', {
		x: playerX,
		y: playerY,
		velocity: playerVel
	});
});

// player2

// socket.on('othersEntrance', function(data) {
// 	// players.push = data.index;
// 	console.log('other person logged on')

// 	var otherCharacter = data.character;
// 	otherPlayer = game.add.sprite(500, game.world.height - 150, 'dude2');
// 	otherPlayer.animations.add('left', [0, 1], 10, true);
// 	otherPlayer.animations.add('right', [3, 4], 10, true);
// 	otherPlayer.animations.add('blink', [5, 6, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5], 10, true);


// });

socket.on('updatePos', function(data) {
		player2Exists = true;
		if (!player2Set){
		player2.exists = true;
		player2Set = true;
	}
		player2.position.x = data.x;
		player2.position.y = data.y;
		if (data.velocity > 0) {
			player2.animations.play('right');
		} else if (data.velocity < 0) {
			player2.animations.play('left');
		} else if (data.velocity === 0) {
			player2.animations.play('blink');
		}

	
		// otherPlayer.position.x = data.x;
		// otherPlayer.position.y = data.y;
		// if (data.velocity > 0) {
		// 	otherPlayer.animations.play('right');
		// } else if (data.velocity < 0) {
		// 	otherPlayer.animations.play('left');
		// } else if (data.velocity === 0) {
		// 	otherPlayer.animations.play('blink');
		// }

});

// socket.on('othersCharacter', function(data){
// 	var otherCharacter = data.character;

// 	var otherPlayer = players.create(500, game.world.height - 150, 'dude' + data.character + 1);
// 	otherPlayer.animations.add('left', [0, 1], 10, true);
// 	otherPlayer.animations.add('right', [3, 4], 10, true);
// 	otherPlayer.animations.add('blink', [5, 6, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5], 10, true);
// })

function turnCreature() {

	if (creatureDirection == 'left') {
		creature.position.x = 3;
		direction *= -1;
		creatureDirection = 'right';
	} else {
		creature.position.x = 1364;
		direction *= -1;
		creatureDirection = 'left';

	}

}

function animateBroccoli() {
	broccoli.body.velocity.y -= 100;
	console.log("touched");
}

var appleOn = false;

function playApple() {
	appleOn = true;
	setTimeout(function() {
		appleOn = false;
	});
	console.log("apple playing")

}

// function looper() {
// 	leafPlayer.toggleLoopPoint(Math.floor(Math.random() * 70));
// }

var index = 0;

function collectStar(player, star) {

	xPos = star.body.position.x
	star.kill()
	makeStar();
	score += 10;
	scoreText.text = 'Arbitrary Score: ' + score;
	playStar();
}

function makeStar() {
	var newStar = stars.create(1215 + index * 40, 200, 'star');
	newStar.body.velocity.y = index * 100 + 20;
	newStar.body.gravity.y = 20;
	index = (index + 1) % 4;
}

function eyesBlink(player, star) {
	console.log('eyes blink');
	if (!eyesOpen) {
		eyes.animations.play('on');
		console.log("opening eyes");
		eyesOpen = true;
	} else {
		eyes.frame = 7;
		console.log("closing eyes");
		eyesOpen = false;
	}
}

function playerOnPlatform(player, platform) {

	for (var i = 0; i < leafLedges.length; i++) {
		if (platform === leafLedges[i]) {
			leafContact = i;
		}
	}
	// console.log('playerOnPlatform');
	// console.log(player);
}

function leafOn(index) {
	if (leafContact >= 0 && prevLeafContact < 0) {
		toggleLoopPoint(Math.floor(Math.random() * 100), leafPlayers[index]);

		// start metering the leaf level
		leafPlayers[index].connect(leafMeters[index]);

	}
}

function leafOff(index) {
	stopLooping(leafPlayers[index]);

	// stop metering the leaf level
	leafPlayers[index].disconnect();

	// reset the tint (just in case)
	leafSprites[index].tint = parseInt(rgb2hex(255, 255, 255));

}

function tintLeaves() {
	for (var i = 0; i < leafMeters.length; i++) {
		var level = leafMeters[i].getLevel();
		level = level * 1000;
		leafSprites[i].tint = parseInt(rgb2hex(255, 255 - level, 255));
	}
}

function playerDistanceFromEyes() {
	// calculate distance from eyes position
	var distance = getDistance(player.x, player.y, eyes.x, eyes.y);
	var normDistance = Tone.prototype.normalize(distance, 1000, 0);

	eyeSynth.setVolume(1 - normDistance);
}

function getDistance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow((x1 - x2), 2), Math.pow((y1 - y2), 2));
}


////////////////// COLOR HELPER FUNCTION
function rgb2hex(red, green, blue) {
	var rgb = blue | (green << 8) | (red << 16);
	var hexString = '#' + (0x1000000 + rgb).toString(16).slice(1)
	return parseInt(hexString.replace(/^#/, ''), 16);
}