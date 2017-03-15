function toggleLogType() {
    if ($('#loginBtn').attr('name') == 'register') {
        $('#emailField').hide()
        $('#fullnameField').hide()
        $('#loginBtn').attr('name', 'login');
        $('#loginBtn').val('Login');
        $('.toggleLoginType').text("Don't have an account? Sign Up!");
        $('.logStat').html('Login');
    } else {
        $('#emailField').show();
        $('#fullnameField').show();
        $('#loginBtn').attr('name', 'register');
        $('#loginBtn').val('Register');
        $('.toggleLoginType').text("Already have an account? Sign In!");
        $('.logStat').html('Register');
    }
}

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

        if (logType == 'register') _data += '&email=' + email + '&fullname=' + fullname;

        // alert(_data);

        $.post({
            url: 'functions.php',
            data: _data,
            contentType: 'application/x-www-form-urlencoded',
            success: function(data) {
                if (data.toLowerCase() == 'ok') window.location = '/carlos';
                else {
                    alert(data.toLowerCase());
                }
            },
            error: function() {
                alert('AJAX ERROR');
            }
        });
    });

    $(document).on('click', '.toggleLoginType', function(e) {
        e.preventDefault();

        toggleLogType();
    });

    $(document).on('click', '.toggleLoginDiv', function() {
        $('.desc').animate({'width': 'toggle'}, 200);
        $('.login').animate({'width': 'toggle'}, 200);

        $('#emailField').show();
        $('#fullnameField').show();
        $('#loginBtn').attr('name', 'register');
        $('#loginBtn').val('Register');
        $('.toggleLoginType').text("Already have an account? Sign In!");
        $('.logStat').html('Register');
    });

    $(document).on('click', '.back-btn', function() {
        $('.login').animate({'width': 'toggle'}, 200);
        $('.desc').animate({'width': 'toggle'}, 200);
    });

});
