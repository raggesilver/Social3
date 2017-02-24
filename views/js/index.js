$(function() {

  // console.log('jquery is alive');

  $('.login-form').on('submit', function(e) {
    e.preventDefault();

    var logType = ($('#loginBtn').attr('name') != 'register') ? 'login' : 'register';
    // alert(logType);

    var username = $('#usernameField').val();
    var password = $('#passwordField').val();
    var email = $('#emailField').val();
    var fullname = $('#fullnameField').val();

    var _data = 'func=' + logType + '&username=' + username + '&password=' + password;

    if(logType == 'register') _data += '&email=' + email + '&fullname=' + fullname;

    // alert(_data);

    $.post({
      url: 'functions.php',
      data: _data,
      success: function(data) {
        alert(data.toLowerCase());
        if(data.toLowerCase() == 'ok') window.location = '/carlos';
      },
      error: function() {
        alert('AJAX ERROR');
      }
    });
  });

  $(document).on('click', '.toggleLoginType', function(e) {
    e.preventDefault();

    if($('#loginBtn').attr('name') == 'register') {
      $('#emailField').hide()
      $('#fullnameField').hide()
      $('#loginBtn').attr('name', 'login');
      $('#loginBtn').val('Login');
      $(this).text("Don't have an account? Sign Up!");
      $('.logStat').html('Login');
    } else {
      $('#emailField').show();
      $('#fullnameField').show();
      $('#loginBtn').attr('name', 'register');
      $('#loginBtn').val('Register');
      $(this).text("Already have an account? Sign In!");
      $('.logStat').html('Register');
    }
  });

});
