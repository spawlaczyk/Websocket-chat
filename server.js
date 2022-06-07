const express = require("express");
const path = require('path');
const socket = require('socket.io');
const db = require('./db');
const messages = db.messages;
const users = db.users;

const app = express();

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('join', (user) => {
    console.log('New user: ' + user.login);
    users.push(user);
    socket.broadcast.emit('newUser', { author: 'Chat Bot', content: user.login + ' has joined the conversation!' });
  });

  socket.on('disconnect', () => { 
    console.log('Oh, socket ' + socket.id + ' has left') 
    console.log('I\'ve added a listener on message event \n');
    const user = users.find((user) => user.id === socket.id);
    const index = users.indexOf(user);
    if(index > 0){
      socket.broadcast.emit('removeUser', { author: 'Chat Bot', content: user.login + ' has left the conversation... :(' });
      users.splice(index, 1);
    };
  });
});