//navigation and pages changing
function getQueryParams() {
    const params = {};
    window.location.search.substring(1).split('&').forEach(function(param) {
        const [key, value] = param.split('=');
        params[key] = decodeURIComponent(value);
    });
    return params;
}
const params = getQueryParams();
const action = params['action'];
if (action === 'login') {
    $('.logIn').css('display', 'flex');
} else if (action === 'register') {
    $('.registraion').css('display', 'flex');
}
$('.backArrow').click(()=>{
    window.location.href = '/';
})
$('#noAccount').click(()=>{
    $('.logIn').css('display', 'none');
    $('.registraion').css('display', 'flex');
})
$('#HaveAnAccount').click(()=>{
    $('.registraion').css('display', 'none');
    $('.logIn').css('display', 'flex');
})