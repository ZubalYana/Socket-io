const app = require('express')();
const express = require('express')
const http = require('http').createServer(app);
const io = require('socket.io')(http)
const PORT = 3000
const path = require('path')
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
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
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