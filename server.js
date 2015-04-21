var io = require('socket.io'),
    UUID = require('node-uuid'),
    connect = require('connect');
var mID = 0,
    characters = [],
    character;

var app = connect().use(connect.static('public')).listen(8080);
var chat_room = io.listen(app);

chat_room.sockets.on('connection', function(socket) {
  socket.character = Math.floor(Math.random() * 2);

  socket.userid = UUID();
  socket.index = mID;

  socket.emit('entrance', {
    message: 'Welcome!',
    id: socket.userid,
    index: socket.index
  });
  

  socket.broadcast.emit('othersEntrance', {
    message: 'someone just came online.',
    id: socket.userid,
    index: mID,
    character: socket.character

  });

  socket.on('playerPos', function(data){
    socket.broadcast.emit('updatePos',{x:data.x, y:data.y, index:data.index, velocity: data.velocity});
  });

  socket.on('character', function(data){
    characters.push(data.character);
    console.log('character chosen: ', data.character);
    character = data. chosenCharacter;
    socket.broadcast.emit('othersCharacter', {character: data.character});
  });

  socket.on('getStatus', function(){
    socket.broadcast.emit('giveStatus');
  });

  socket.on('respondStatus', function(data){
    chat_room.sockets.emit('initPos', data);
  });



  socket.on('disconnect', function() {
    chat_room.sockets.emit('exit', {
      message: 'someone has disconnected.',
      killID: mID
    });
  });

  mID++;


  socket.on('chat', function(data) {
    chat_room.sockets.emit('chat', {
      message: '# ' + data.message
    });
  });

});