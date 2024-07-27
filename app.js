const app = require('express')();
const express = require('express')
const http = require('http').createServer(app);
const io = require('socket.io')(http)
const PORT = 3000
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req,res)=>{
    res.sendFile(__dirname, 'public', 'index.html')
})
app.listen(PORT, ()=>{
    console.log(`Server works on PORT: ${PORT}`)
})