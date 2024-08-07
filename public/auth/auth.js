//navigation and pages changing
$('.backArrow').click(()=>{
    $('.registrationContainer').css('display', 'none');
    $('.logInContainer').css('display', 'none');

})
$('#noAccount').click(()=>{
    $('.logIn').css('display', 'none');
    $('.registraion').css('display', 'flex');
})
$('#HaveAnAccount').click(()=>{
    $('.registrationContainer').css('display', 'none');
    $('.logInContainer').css('display', 'flex');
})
$('#logInCart').click(function() {
    $('.registrationContainer').css('display', 'none');
    $('.logInContainer').css('display', 'flex');
    $('.greeting').css('display', 'none');

});
$('#registraionCart').click(function() {
    $('.logInContainer').css('display', 'none');
    $('.registrationContainer').css('display', 'flex');
    $('.greeting').css('display', 'none');

})

