$(function(){
    $(document).on('click', 'img', function() {
        var url = $(this).attr('src');

        if($(this).hasClass('profpic')) {
            if (url.indexOf('small') !== -1) {
                var user = url.split('/')[3];
                url = (UrlExists('/carlos/users/' + user + '/profpic.jpg')) ? '/carlos/users/' + user + '/profpic.jpg' : url;
            }
        }

        $('.img-full img').attr('src', url);
        $('.img-full').show();
    });

    $(document).on('click', '.img-full', function() {
        $('.img-full').hide();
    });

    $(document).on('click', '.profile-link', function() {
        var prof = $(this).text().replace('@', '');
        window.location = '/carlos/?profile=' + prof;
    });

    $(document).on('click', '.like-btn', function() {
        if ($(this).hasClass('liked')) {
            $(this).removeClass('liked');
        } else {
            $(this).addClass('liked');
        }
    });
});
