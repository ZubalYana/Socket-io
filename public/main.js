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

socket.on('users', (count)=>{
    console.log(count)
    $('.usersOnline').html(`Users online: <span>${count}</span> `)
})

//pages navigation
$('#logInCart').click(function() {
    window.location.href = '/auth?action=login';
});
$('#registraionCart').click(function() {
    window.location.href = '/auth?action=register';
})