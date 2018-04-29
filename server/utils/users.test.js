const expect = require('expect');

const { Users } = require('./users.js');

describe('Users', () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Nuno',
      room: 'first room'
    }, {
      id: '2',
      name: 'Rita',
      room: 'second room'
    }, {
      id: '3',
      name: 'Paipai',
      room: 'first room'
    }];
  });

  it('should add new user', () => {
    const users = new Users();
    const user = {
      id: '123',
      name: 'Nuno',
      room: 'some room'
    };
    const resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should remove user by id', () => {
    const getUser = users.removeUser('1');

    expect(getUser.id).toBe('1');
    expect(users.users.length).toBe(2);
  });

  it('should not remove user by unexisting id', () => {
    const getUser = users.removeUser('99');

    expect(getUser).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it('should return user by id', () => {
    const getUser = users.getUser('1');

    expect(getUser.id).toBe('1');
  });

  it('should not return user by unexisting id', () => {
    const getUser = users.getUser('99');

    expect(getUser).toNotExist();
  });

  it('should return names for first room', () => {
    const userList = users.getUserList('first room');

    expect(userList).toEqual(['Nuno', 'Paipai']);
  });

  it('should return names for first room', () => {
    const userList = users.getUserList('second room');

    expect(userList).toEqual(['Rita']);
  });
});
