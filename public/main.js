let socket = io()
$('#send').click(()=>{
    socket.emit('chat message', $('#message').val())
    $('#message').val('')
})

socket.on('chat message', (data)=>{
    console.log(data)
    $('.messageContainer').append(
        `
        <div class="message">${data}</div>
        `
    )
})