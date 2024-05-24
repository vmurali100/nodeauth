const fs = require('fs');
const path = require('path');

const userDataPath = path.join(__dirname, 'userData.json');

function getUsers() {
  const data = fs.readFileSync(userDataPath);
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(userDataPath, JSON.stringify(users, null, 2));
}

function getAllUsers() {
  return getUsers();
}

function getUserById(userId) {
  const users = getUsers();
  return users.find(user => user.id === userId);
}

function getUserByUsername(username) {
  const users = getUsers();
  return users.find(user => user.username === username);
}

function addUser(newUser) {
  const users = getUsers();
  newUser.id = users.length + 1;
  users.push(newUser);
  saveUsers(users);
}

function updateUser(userId, updatedUserData) {
  const users = getUsers();
  const index = users.findIndex(user => user.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUserData };
    saveUsers(users);
    return true;
  }
  return false;
}

function deleteUser(userId) {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== userId);
  saveUsers(filteredUsers);
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  addUser,
  updateUser,
  deleteUser
};
