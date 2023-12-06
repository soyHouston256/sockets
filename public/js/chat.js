const username = localStorage.getItem('name');
if (!username) {
  window.location.replace('/');
  throw new Error('Username is required');
}

const lblStatusOnline = document.querySelector('#status-online');
const lblStatusOffline = document.querySelector('#status-offline');

const usersUlElement = document.querySelector('#status-online');
const form = document.querySelector('form');
const input = document.querySelector('input');
const chatElement = document.querySelector('#chat');
const renderUsers = (users) => {
  usersUlElement.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerHTML = `<p>
      <h5 class="text-success">${user.name}</h5>
    </p>`;
    usersUlElement.append(li);
  });
};

const renderMessage = (payload) => {
  const { userId, message, name } = payload;

  const divElement = document.createElement('div');
  divElement.classList.add('message');

  if (userId !== socket.id) {
    divElement.classList.add('incoming');
  }
  divElement.innerHTML = `
    <small>${name}</small>
    <p>${message}</p>
  `;
  chatElement.append(divElement);
  chatElement.scrollTop = chatElement.scrollHeight;
};

const socket = io({
  auth: {
    token: 'ABC-123',
    name: username,
  },
});

socket.on('connect', () => {
  lblStatusOnline.classList.remove('hidden');
  lblStatusOffline.classList.add('hidden');
});

socket.on('disconnect', () => {
  lblStatusOnline.classList.add('hidden');
  lblStatusOffline.classList.remove('hidden');
});

socket.on('welcome-message', (message) => {
  console.log('message', message);
});

socket.on('on-clients-changed', renderUsers);

socket.on('on-message', renderMessage);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = input.value;
  if (!message) {
    return;
  }
  socket.emit('send-message', message);
  input.value = '';
});
