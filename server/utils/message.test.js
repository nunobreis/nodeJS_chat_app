const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    const from = 'Nuno';
    const text = 'Hello World';
    const message = generateMessage(from, text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({ from, text });
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const from = 'Chatbot';
    const latitude = 1;
    const longitude = 1;
    const url = 'https://www.google.com/maps?q=1,1';
    const location = generateLocationMessage(from, latitude, longitude);

    expect(location.createdAt).toBeA('number');
    expect(location).toInclude({ from, url });
  });
});
