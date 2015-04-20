

var game = new Phaser.Game(1400, 800, Phaser.AUTO, 'chatroom', { preload: preload, create: create, update: update });
var socket = io.connect('http://localhost:8080');

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
	game.load.image('smallgrass', './assets/smallgrass.png');
	game.load.spritesheet('dude', './assets/dude.png', 32, 42);
	game.load.spritesheet('baddie', './assets/baddie.png', 32, 32);
	game.load.spritesheet('flower', './assets/flower.png', 215, 215);
	game.load.spritesheet('eyes', './assets/eyes.png', 70, 25);
}

var platforms;
var leafs;
var flower;
var player;
var eyes;
var eyesOpen = false;
var apple;
var creature;
var score = 0;
var scoreText;
var direction = -1;
var creatureDirection = 'left';
var playerX,
	playerY;

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

	platforms = game.add.group();
	platforms.enableBody = true;



	var sky = game.add.sprite(0,0,'sky');
	// sky.width = w;
	// sky.height = h; 
	var tree = game.add.sprite(80, game.world.height - 300, 'tree');
	tree.scale.setTo(.6,.6);

	eyes = game.add.sprite(174, game.world.height - 240, 'eyes');
	// eyes.enableBody = true;
	// eyes.body.immovable = true;


	var ledge = platforms.create(608, game.world.height - 200, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.23,.05);
	var leaf = game.add.sprite(602, game.world.height - 226, 'leftleaf');
	leaf.scale.setTo(.66,.66);

	var ledge = platforms.create(534, game.world.height - 494, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.23,.05);
	var leaf = game.add.sprite(528, game.world.height - 520, 'leftleaf');
	leaf.scale.setTo(.66,.66);

	var ledge = platforms.create(726, game.world.height -354, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.23,.05);
	var leaf = game.add.sprite(720, game.world.height - 380, 'rightleaf');
	leaf.scale.setTo(.66,.66);

	game.add.sprite(580,100, 'stem');
	flower = game.add.sprite(580,10, 'flower');

	game.add.sprite(game.world.width - 400, game.world.height - 310, 'cave');
	
	

	//leafs = game.add.group();


	//clouds = game.add.sprite();
	//clouds.enableBody = true;


	var ledge = platforms.create(74, 220, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.44,.5);
	var cloud = game.add.sprite(70, 200, 'cloud');

	var ledge = platforms.create(1094, 180, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.44,.5);
	var leaf = game.add.sprite(1090, 160, 'cloud');

	var ledge = platforms.create(804, 240, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.44,.5);
	var cloud = game.add.sprite(800, 220, 'cloud');

	var ledge = platforms.create(946, 410, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.44,.5);
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

	var apple = game.add.sprite(260, game.world.height - 60, 'apple');
	apple.scale.setTo(.7,.7);

	creature = game.add.sprite(game.world.width - 90, game.world.height - 120, 'baddie');
	player = game.add.sprite(500, game.world.height - 150, 'dude');

	game.add.sprite(game.world.width - 400, game.world.height - 310, 'frontcave');
	var grass = game.add.sprite(game.world.width - 130, game.world.height - 70, 'smallgrasspatch');

	
	
	grass.scale.setTo(1.1, 1);
	ground.scale.setTo(4, 4);

	ground.body.immovable = true;

	var ledge = platforms.create(game.world.width - 165, game.world.height - 250, 'platform');
	ledge.body.immovable = true;
	ledge.scale.setTo(.75,3.4);

	
	game.physics.arcade.enable(player);
	game.physics.arcade.enable(creature);
	player.body.bounce.y = .180;
	player.body.gravity.y = 425;
	creature.body.bounce.y = 0;
	creature.body.gravity.y = 425;
	player.body.collideWorldBounds = true;
	creature.body.collideWorldBounds = true;

	player.animations.add('left', [0,1,2,3], 10, true);
	player.animations.add('right',[5,6,7,8], 10, true);
	creature.animations.add('left', [0,1], 10, true);
	creature.animations.add('right',[2,3], 10, true);
	//creature.events.onEnterBounds.add( function(){console.log('collision')}, this );
	//creature.checkWorldBounds = true;

	var eyeList = [];
	for (var i = 0; i < 28; i++){
		eyeList.push(i);
	}

	eyes.animations.add('on', eyeList, 10, true);
	flower.animations.add('on', [1,2,3,4,5,6,7,8,9,10,11,12,13,14], 20, true);
	cursors = game.input.keyboard.createCursorKeys();


	stars = game.add.group();
	stars.enableBody = true;
	

	for (var i = 0; i < 20; i++){
		var star = stars.create(i * 70, 0, 'star');
		star.body.gravity.y = 425;
		star.body.bounce.y = 1;
	}



	scoreText = game.add.text(16, 16, 'Arbitrary Score: 0', {
		fontSize: '28px', fill: '#000'});

	eyes.animations.play('on');

	//eyes.frame = 7;

}

function update() {
	
	game.physics.arcade.collide(player, platforms);
	// game.physics.arcade.collide(player, eyes);

	//game.physics.arcade.collide(player, creature);
	game.physics.arcade.collide(creature, platforms);
	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.overlap(player, stars, collectStar, null, this);
	// game.physics.arcade.overlap(player, eyes, eyesBlink, null, this);
	


	// if (creature.position.x < 2 || creature.position.x > 1365){
	// 	turnCreature();
	// }

	
	creature.body.velocity.x = direction * 150;
	player.body.velocity.x = 0;

	if (cursors.left.isDown){
		player.body.velocity.x = -150;
		player.animations.play('left');
	}else if (cursors.right.isDown){
		player.body.velocity.x = 150;
		player.animations.play('right');
	}else{
		player.animations.stop();
		player.frame = 4;
	}

	if (cursors.up.isDown && player.body.touching.down){
		player.body.velocity.y = -400;
	}
	//creature.frame = 1;
	flower.animations.play('on');
	
	creature.animations.play(creatureDirection);

	playerX = player.position.x;
	playerY = player.position.y;
	socket.emit('playerPos', {x:playerX, y:playerY});
}

socket.on('updatePos', function(data){
	console.log(data.x, data.y);
})

function turnCreature(){
	
	if (creatureDirection == 'left'){
		creature.position.x = 3;
		direction *= -1;
		creatureDirection = 'right';
	}else{
		creature.position.x = 1364;
		direction *= -1;
		creatureDirection = 'left';

	}

}

function looper(){
	toggleLoopPoint(Math.floor(Math.random() * 70));
}

function collectStar (player, star){
	star.kill();
	score+= 10;
	scoreText.text = 'Arbitrary Score: ' + score;
	//looper();
}

function eyesBlink (player, star){
	if (!eyesOpen){
	eyes.animations.play('on');
	console.log("opening eyes");
	eyesOpen = true;
}else{
	eyes.frame = 7;
	console.log("closing eyes");
	eyesOpen = false;
}
}
// })
