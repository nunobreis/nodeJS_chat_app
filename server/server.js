const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {
  generateMessage,
  generateLocationMessage
} = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

// io.emit - emits to everyone connected
// socket.broadcast.emit - emits to everyone connected but me
// socket.emit - emits to a specific user

io.on('connection', (socket) => {
  console.log('New User connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Nickname and Room are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    // Emit to Specific rooms:
    // io.to('Some Room').emit
    // socket.brodcast.to('Some Room').emit

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('JabberBot', 'Welcome to the JabberApp'));
    socket.broadcast
      .to(params.room)
      .emit('newMessage', generateMessage('JabberBot', `${params.name} has joined!`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage(
      'Chatbot',
      coords.latitude,
      coords.longitude
    ));
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', `${user.name} has left.`);
    }
  });
});

server.listen(port, () => {
  console.log(`Started on port ${port}`);
});
