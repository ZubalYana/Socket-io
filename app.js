const app = require('express')();
const express = require('express')
const http = require('http').createServer(app);
const io = require('socket.io')(http)
const PORT = 3000
const path = require('path')
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';
const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://zubalana0:QFvTLw87WQlJW3cS@cluster0.wrtk5ym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
`)
.then(()=>{
    console.log(`Connected to mongo DB`)
})
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req,res)=>{
    res.sendFile(__dirname, 'public', 'index.html')
})
const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String }
});
const User = mongoose.model('User', userSchema);

//user registration
app.post('/auth/register', async (req, res) => {
    const { firstname, lastname, password, email } = req.body;
    if (!firstname || !lastname || !password || !email )  {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });

    try {
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'User already exists' });
    }
});

//user login
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'email and password are required' });
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

//logout
app.post('/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/auth', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'auth', 'auth.html'))
})
let usersCount = 0;
io.on('connection', (socket)=>{
    console.log('New user connected')
    usersCount++
    io.emit('users', usersCount)
    socket.on('chat message', (msg)=>{
        io.emit( 'chat message', msg);
    })
    socket.on('disconnect', ()=>{
        usersCount--
        io.emit('users', usersCount)
    })
})

http.listen(PORT, ()=>{
    console.log(`Server works on PORT: ${PORT}`)
})