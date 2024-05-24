const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');

const userRouter = express.Router();
const secretKey = 'your_secret_key'; // Change this to a secure key

// Middleware to parse JSON bodies
userRouter.use(bodyParser.json());

// Login endpoint
userRouter.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Authentication logic (replace with your actual authentication logic)
  const user = userController.getUserByUsername(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: '1h' });

  // Return JWT token
  res.json({ token });
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  console.log(req.headers)
  const token = req.headers['authorization'].split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    req.userId = decoded.userId;
    next();
  });
}

// CRUD endpoints for users
userRouter.get('/', verifyToken, (req, res) => {
  const users = userController.getAllUsers();
  res.json(users);
});

userRouter.post('/registerUser', (req, res) => {
  const newUser = req.body;
  userController.addUser(newUser);
  res.status(201).json({ message: 'User added successfully' });
});

userRouter.put('/:id', verifyToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;
  const success = userController.updateUser(userId, updatedUser);
  if (success) {
    res.json({ message: 'User updated successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

userRouter.delete('/:id', verifyToken, (req, res) => {
  const userId = parseInt(req.params.id);
  userController.deleteUser(userId);
  res.json({ message: 'User deleted successfully' });
});

module.exports = userRouter;
