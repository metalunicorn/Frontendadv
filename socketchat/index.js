var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const cors = require('cors')

app.use(cors())

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('an user connected with id', socket.id);
  socket.on('msg', function(msg){
      if (msg && msg.message && msg.nick){
          io.emit('msg', msg)
      }
      else {
          console.log('WRONG MESSAGE', msg)
      }
  })
  socket.on('disconnect', function(){
    console.log('user disconnected '+ socket.id);
  });
});

http.listen(4000, function(){
  console.log('listening on *:4000');
});

