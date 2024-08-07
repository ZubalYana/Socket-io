// Navigation and pages changing
$('.backArrow').click(() => {
    $('.registrationContainer').css('display', 'none');
    $('.logInContainer').css('display', 'none');
    $('.greeting').css('display', 'flex');
  });
  
  $('#noAccount').click(() => {
    $('.logInContainer').css('display', 'none');
    $('.registrationContainer').css('display', 'flex');
  });
  
  $('#HaveAnAccount').click(() => {
    $('.registrationContainer').css('display', 'none');
    $('.logInContainer').css('display', 'flex');
  });
  
  $('#logInCart').click(function () {
    $('.registrationContainer').css('display', 'none');
    $('.logInContainer').css('display', 'flex');
    $('.greeting').css('display', 'none');
  });
  
  $('#registraionCart').click(function () {
    $('.logInContainer').css('display', 'none');
    $('.registrationContainer').css('display', 'flex');
    $('.greeting').css('display', 'none');
  });
  
  // Registration
  $('#registraion').click(async function () {
    const firstname = $('#reg_name').val();
    const lastname = $('#reg_lastName').val();
    const email = $('#reg_email').val();
    const password = $('#reg_password').val();
    try {
      const response = await axios.post('/auth/register', { firstname, lastname, email, password });
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  });
  
  // Login
  $('#logIn').click(async function () {
    const email = $('#logIn_email').val();
    const password = $('#logIn_password').val();
    try {
      const response = await axios.post('/auth/login', { email, password });
      alert(response.data.message);
      if (response.status === 200) {
        window.location.href = '/homepage';
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  });