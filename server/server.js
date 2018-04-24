const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {
  generateMessage,
  generateLocationMessage
} = require('./utils/message');
const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New User connected');

  socket.emit('newMessage', generateMessage('Chatbot', 'Welcome to the Chat App'));

  socket.broadcast.emit('newMessage', generateMessage('Chatbot', 'New user joined!'));

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from the server');
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage(
      'Chatbot',
      coords.latitude,
      coords.longitude
    ));
  });

  socket.on('disconnect', (socket) => {
    console.log('Client disconnected from server');
  });
});

server.listen(port, () => {
  console.log(`Started on port ${port}`);
});
