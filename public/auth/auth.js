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