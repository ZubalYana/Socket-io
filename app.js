const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
mongoose.connect('mongodb+srv://zubalana0:QFvTLw87WQlJW3cS@cluster0.wrtk5ym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected to MongoDB');
  });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 
app.use(cookieParser());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String }
});

const User = mongoose.model('User', userSchema);

// User registration
app.post('/auth/register', async (req, res) => {
  const { firstname, lastname, password, email } = req.body;
  if (!firstname || !lastname || !password || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ firstname, lastname, email, password: hashedPassword });

  try {
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'User already exists' });
  }
});

// User login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, secure: true });
  res.status(200).json({ message: 'Logged in successfully' });
});

// Logout
app.post('/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});

// Middleware
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'auth', 'auth.html'));
});

let usersCount = 0;
io.on('connection', (socket) => {
  console.log('New user connected');
  usersCount++;
  io.emit('users', usersCount);
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  socket.on('disconnect', () => {
    usersCount--;
    io.emit('users', usersCount);
  });
});

http.listen(PORT, () => {
  console.log(`Server works on PORT: ${PORT}`);
});