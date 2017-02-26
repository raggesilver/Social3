var username, name, surname, fullname, selfpic;

function UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}

function setUserInfo() {
    console.log('set user info, ' + fullname);
    $('.self-fullname').html(fullname);
    $('.side-menu-username').text('@' + username);
    $('.side-menu-username').attr('href', '/carlos/?profile=' + username);

    var url = (UrlExists('/carlos/users/' + username + '/profpic-small.png')) ? '/carlos/users/' + username + '/profpic-small.png' : '/carlos/views/res/default-user.jpg';

    selfpic = url;

    $('.self-profpic-sm').attr('src', url);
}

function getUserInfo() {

    $.post({
        url: '/carlos/functions.php',
        data: 'func=selfinfo',
        success: function(_data) {
            data = JSON.parse(_data);
            username = data.username;
            fullname = data.fullname;
            name = data.fullname.split(' ')[0];
            surname = data.fullname.split(' ')[data.fullname.split(' ').length - 1];

            setUserInfo();
            generateFeed();
        },
        error: function(err) {
            alert(err);
        }
    });

}

function makePost() {

    var content = $('.write-box textarea').val();

    if (!(/\S/.test(content))) return;

    $.post({
        url: '/carlos/functions.php',
        data: 'func=post&content=' + content,
        success: function(data) {
            if (data == 'OK') {
                var div = document.createElement('div');
                $(div).addClass('feed-card');
                $(div).append('<img class="post-profpic profpic" src="' + selfpic + '">');
                $(div).append('<a class="profile-link">@' + username + '</a>');
                $(div).append('<p> - ' + 'now' + '</p>');
                $(div).append('<div class="clear"></div>');
                $(div).append('<p class="content">' + content + '</p>');
                $(div).append('<table><tr><td><button class="img-button like-btn"><i class="fa fa-heart" aria-hidden="true"></i></button></td><td><button class="img-button"><i class="fa fa-mail-forward" aria-hidden="true"></i></button></td><td><button class="img-button"><i class="fa fa-comment" aria-hidden="true"></i></button></td></tr></table>');
                $('.write-box').after(div);

                $('.write-box textarea').val('');
            } else {
                alert(data);
            }
        },
        error: function(err) {
            alert('error: ' + err);
        }
    });
}

function generateFeed() {
    $.post({
        url: '/carlos/functions.php',
        data: 'func=generateFeed',
        success: function(data) {
            var json = JSON.parse(data);
            for (var post of json) {
                var publisher = post.publisher;
                var content = post.content;
                var postdate = post.postdate;

                var url = (UrlExists('/carlos/users/' + publisher + '/profpic-small.png')) ? '/carlos/users/' + publisher + '/profpic-small.png' : '/carlos/views/res/default-user.jpg';

                var div = document.createElement('div');
                $(div).addClass('feed-card');
                $(div).append('<img class="post-profpic profpic" src="' + url + '">');
                $(div).append('<a class="profile-link">@' + publisher + '</a>');
                $(div).append('<p> - ' + postdate + '</p>');
                $(div).append('<div class="clear"></div>');
                $(div).append('<p class="content">' + content + '</p>');
                $(div).append('<table><tr><td><button class="img-button like-btn"><i class="fa fa-heart" aria-hidden="true"></i></button></td><td><button class="img-button"><i class="fa fa-mail-forward" aria-hidden="true"></i></button></td><td><button class="img-button"><i class="fa fa-comment" aria-hidden="true"></i></button></td></tr></table>');
                $('.feed').append(div);
            }
        },
        error: function(err) {
            alert(err);
        }
    });
}

$(function() {

    getUserInfo();

    $(document).on('click', '.publishButton', function() {
        console.log('publish');
        makePost();
    });

    $(document).on('click', '.attatchImgButton', function() {
        console.log('fired');
        $('.attatchFileInput').click();
    });

    $(document).on('change', '.attatchFileInput', function(e) {
        var files = e.target.files;

        for (var i = 0; i < files.length; i++) {

            var f = files[i];

            if (!f.type.match('image.*'))
                continue;

            var reader = new FileReader();

            reader.onload = (function(theFile) {
                return function(e) {
                    var span = document.createElement('span');
                    span.innerHTML = ['<img class="thumb" src="', e.target.result,
                        '" title="', escape(theFile.name), '"/>'
                    ].join('');
                    $('.preview-box').append(span);
                };

            })(f);

            reader.readAsDataURL(f);

        }
    });

    $(document).on('input change keyup paste', '.write-box textarea', function() {
        if ($(this).val().length <= 40) {
            $(this).addClass('big-font');
        } else {
            $(this).removeClass('big-font');
        }
    });

});
