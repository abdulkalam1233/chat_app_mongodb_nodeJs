const {
  mongoose
} = require('./DB/mongoose');
const {
  User
} = require('./models/User');
const {
  Message
} = require('./models/Message');
const express = require('express');
const bodyparser = require('body-parser');
const {
  SHA256
} = require('crypto-js');
var socketio = require('socket.io');
var http = require('http');

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: false
}));
app.use(express.static('./public'));

var clients = [];
users = {};
var server = http.createServer(app);

server.listen(8080);
var io = socketio.listen(server);

app.post('/signup', (req, res) => {
  let newUser = new User();
  newUser.userId = req.body.uid;
  newUser.name = req.body.uname;
  newUser.age = req.body.age;
  newUser.gender = req.body.gen;
  newUser.pwd = req.body.pwd;

  newUser.save((err, nUser) => {
    if (err) {
      console.log(err);
      res.status(400).send("Unable to insert the user");
    } else {
      clients.push(nUser.userId)
      res.redirect('/chatting')
    }
  });

});

app.post('/login', (req, res) => {
  User.find({
    userId: req.body.id,
    pwd: req.body.pwd
  }, (err, doc) => {
    if (err) {
      res.send('erro');
    } else if (doc.length == 0) {

      res.send("no result")
    } else {
      clients.push(req.body.id)
      res.redirect("/chatting");
    }
  });
});

app.get('/chatting', (req, res) => {

  res.sendfile(__dirname + '/public/userUi.html');
});

io.sockets.on('connection', (socket) => {

  socket.nickname = clients[clients.length - 1];
  users[socket.nickname] = socket;
  // Handle chat event
  socket.on('chat', function (data) {
    console.log(data.handle)
    if (data.handle in users) {
      let newMessage = Message();
      newMessage.senderId = socket.nickname;
      newMessage.receiverId = data.handle;
      newMessage.time = Date.now();
      newMessage.text = data.message;
      newMessage.save((err, msg) => {
        if (err) {
          socket.emit("err-msg2","unable to send message character must be 1")
        } else {
          users[socket.nickname].emit('mes-reciever', {
            'from': socket.nickname,
            'msg': data.message,
            'to': data.handle
          });
          users[data.handle].emit('mes-sender', {
            'from': socket.nickname,
            'msg': data.message,
            'to': data.handle
          });
        }
      });

    } else
      users[socket.nickname].emit('error-msg', data.handle);
  });

  socket.on('showUsers', function () {
    users[socket.nickname].emit('showUsers', Object.keys(users));
  });

  socket.on('chat-hist', (data) => {

    Message.find({
      $or: [{
        senderId: socket.nickname,
        receiverId: data
      }, {
        senderId: data,
        receiverId: socket.nickname
      }]
    }, (err, docs) => {
      if (err) {

      } else {
        users[socket.nickname].emit('chat-hist', data, docs.sort({
          time: 1
        }));
      }
    });
  });
  socket.on('disconnect', (data) => {
    delete users[socket.nickname]
  });
});