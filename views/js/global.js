var isSearching = false;

function UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}

$(function(){
    $(document).on('click', 'img', function() {
        var url = $(this).attr('src');

        // if($(this).hasClass('profpic')) {
        //     if (url.indexOf('small') !== -1) {
        //         var user = url.split('/')[3];
        //         url = (UrlExists('/carlos/users/' + user + '/profpic.jpg')) ? '/carlos/users/' + user + '/profpic.jpg' : url;
        //     }
        // }

        $('.img-full img').attr('src', url);
        $('.img-full').fadeIn(200);
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

    $(document).on('click', '.share-button', function(){

        var id = Number($(this).closest('.feed-card').data('id'));

        var contentJson = JSON.stringify({
            'sharing': true,
            'postid': id
        });

        $.post({
            url: '/carlos/functions.php',
            data: {
                'func': 'post',
                'content': contentJson
            },
            success: function(data){
                alert(data);
            }
        });
    });

    $(document).on('click', '.self-profile-link', function(e){
        e.preventDefault();
        window.location.href = '/carlos/?profile=' + username;
    });

    $(document).on('click', '.search-btn', function(){
        $('.search-full').animate({'height': 'toggle'}, 200);
    });

    $(document).on('click', '.search-return-button', function(){
        $('.search-full').animate({'height': 'toggle'}, 200);
    });

    $(document).on('keyup paste change', '.search-full input', function(){
        var input = $(this);
        // if($(input).val().length <= 1) return;
        if(isSearching) return;
        $.post({
            url: '/carlos/functions.php',
            data: {
                'func': 'search',
                'search': $(input).val()
            },
            beforeSend: function() {

                $('.do-search-button').html('<i class="fa fa-circle-o-notch fa-spin fa-fw" aria-hidden="true"></i>');

            },
            success: function(data) {
                $('.search-full .result-container').html('');
                var result = JSON.parse(data);
                if(result.length == 0) {
                    $('.search-full .result-container').html('<li class="result-card"><span style="line-height:50px; text-align: center; display: block;">No results.</span></li>');
                }
                for (var user of result) {
                    var li = document.createElement('li');
                    $(li).addClass('result-card');
                    var img = document.createElement('img');
                    $(img).addClass('profpic');
                    $(img).attr('src', user.profpic);
                    $(li).append(img);
                    var a = document.createElement('a');
                    $(a).text('@' + user.username);
                    $(a).addClass('profile-link');
                    $(li).append(a);
                    $('.search-full .result-container').append(li);
                }
                isSearching = false;
                $('.do-search-button').html('<i class="fa fa-search" aria-hidden="true"></i>');
            },
            error: function(err){
                alert(err);
                isSearching = false;
                $('.do-search-button').html('<i class="fa fa-search" aria-hidden="true"></i>');
            }
        });
    });
});
