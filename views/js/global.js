function UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}

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

        var me = $(this);

        $.post({
            url: '/carlos/functions.php',
            data: 'func=toggleLike&id=' + Number($(this).closest('.feed-card').data('id')),
            success: function(data) {
                if ($(me).hasClass('liked')) {
                    $(me).removeClass('liked');
                    var curLikes = Number($(me).find('.post-likes').html());
                    curLikes = (curLikes - 1 > 0) ? curLikes - 1 : '';
                    $(me).find('.post-likes').html(curLikes);
                } else {
                    $(me).addClass('liked');
                    var curLikes = Number($(me).find('.post-likes').html()) + 1;
                    $(me).find('.post-likes').html(curLikes);
                }
            },
            error: function(err) {alert('error: ' + err);}
        });
    });
});
