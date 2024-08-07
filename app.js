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