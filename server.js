var io = require('socket.io'),
    UUID = require('node-uuid'),
    connect = require('connect');
var mID = 0;

var app = connect().use(connect.static('public')).listen(8080);
var chat_room = io.listen(app);

chat_room.sockets.on('connection', function(socket) {

  socket.userid = UUID();
  socket.emit('entrance', {
    message: 'Welcome!',
    id: socket.userid
  });
  mID++;

  chat_room.sockets.emit('othersEntrance', {
    message: 'someone just came online.'
  });

  socket.on('playerPos', function(data){
    chat_room.sockets.emit('updatePos',{x:data.x, y:data.y});
  })



  socket.on('disconnect', function() {
    chat_room.sockets.emit('exit', {
      message: 'someone has disconnected.'
    });
  });


  socket.on('chat', function(data) {
    chat_room.sockets.emit('chat', {
      message: '# ' + data.message
    });
  });

});