[{
  id: 'adjaskdjaç',
  name: 'Nuno',
  room: 'some room'
}]

// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)

class Users {
  constructor () {
    this.users = [];
  }

  addUser(id, name, room) {
    const user = { id, name, room };
    this.users.push(user);
  }

  removeUser(id) {
    const removeUser = this.users.filter((user) => user.id === id)[0];

    if (removeUser) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return removeUser;
  }

  getUser(id) {
    return this.users.filter((user) => user.id === id)[0];
  }

  getUserList(room) {
    const users = this.users.filter((user) => user.room === room);
    const namesArray = users.map((user) => user.name);

    return namesArray;
  }
}

module.exports = { Users };
