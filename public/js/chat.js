const socket = io();

const scrollToBottom = () => {
  // selectors
  const messages = $('#messages');
  const newMessage = messages.children('li:last-child');
  // heights
  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', () => {
  const params = $.deparam(window.location.search);

  socket.emit('join', params, (error) => {
    if (error) {
      window.alert(error);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('updateUserList', (users) => {
  const ol = $('<ol></ol>');

  users.forEach((user) => {
    ol.append($('<li></li>').text(user));
  });

  $('#users').html(ol);
});

socket.on('updateUserList', (users) => {
  console.log('Users list', users);
});

socket.on('newMessage', (message) => {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = $('#message-template').html();
  const html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  $('#messages').append(html);
  scrollToBottom();
});

$('#message-form').on('submit', (event) => {
  event.preventDefault();

  const messageTextBox = $('[name=message]');

  socket.emit('createMessage', {
    text: messageTextBox.val()
  }, () => {
    messageTextBox.val('');
  });
});

socket.on('newLocationMessage', (message) => {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = $('#location-message-template').html();
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  $('#messages').append(html);
  scrollToBottom();
});

const locationButton = $('#send-location');

locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition((position) => {
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, () => {
    alert('Unable to fetch location');
  });
});
