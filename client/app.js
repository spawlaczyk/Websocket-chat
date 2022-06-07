const socket = io();

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('newUser', ({ author, content }) => addMessage(author, content));
socket.on('removeUser', ({ author, content }) => addMessage(author, content));

const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName = '';

const login = function(event) {
  event.preventDefault();
  
  if(userNameInput.value){
    userName = userNameInput.value;
    socket.emit('join', { id: socket.id, login: userName });
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  } else {
    alert('This field cannot be empty!');
  };
};

const addMessage = function(author, content) {
  const message = document.createElement('li');
  message.classList.add('message--received');
  message.classList.add('message');
  
  if(author === userName) message.classList.add('message--self');

  message.innerHTML = 
  `<h3 class='message__author'>${userName === author ? 'You' : author}</h3>
  <div class='message__content ${author == 'Chat Bot' ? 'chat-bot' : ''}'>
    ${content}
  </div>`;
  messagesList.appendChild(message);
};

const sendMessage = function(event) {
  event.preventDefault();

  let messageContent = messageContentInput.value;

  if(messageContent) {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent });
    messageContentInput.value = '';
  } else {
    alert('Type your message here');
  };
};

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);