var username, name, surname, fullname, selfpic, totalPosts;

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
    $('.side-menu-totalposts').text(totalPosts + ' posts');

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
            totalPosts = data.totalPosts;

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

    var contentType = 'text';

    if (!(/\S/.test(content))) return;

    var mediaCount = $('.attatchFileInput').get(0).files.length;

    if(mediaCount == 1) {
        contentType = 'media';
    } else if (mediaCount > 1) {
        contentType = 'gallery'
    }

    var files = [];

    if(mediaCount > 0) {
        $('.preview-box span .thumb').each(function(index){
            files.push($(this).attr('src'));
        });
    }

    var contentObj = JSON.stringify({
        'contentType': contentType,
        'content': content,
        'media': files
    });

    // alert(contentObj);

    $.post({
        url: '/carlos/functions.php',
        data: {
            'func': 'post',
            'content': contentObj
        },
        beforeSend: function(){
            $('.publishButton').html('<i style="color:white" class="fa fa-circle-o-notch fa-spin fa-fw"></i>');
        },
        success: function(data) {
            if (data == 'OK') {
                location.reload();

            } else {
                alert(data);
                console.log(data);
                $('.publishButton').html('<i class="fa fa-paper-plane" aria-hidden="true"></i>');
            }
        },
        error: function(err) {
            alert('error: ' + err);
            console.log(err);
            $('.publishButton').html('<i class="fa fa-paper-plane" aria-hidden="true"></i>');
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
                var contentObj = JSON.parse(post.content);
                var postdate = post.postdate;
                var id = post.id;
                var liked = post.liked;
                var likes = post.likes;

                var type = contentObj.contentType;
                var content = contentObj.content;

                var attatchments = contentObj.attatchments;

                var url = (UrlExists('/carlos/users/' + publisher + '/profpic-small.png')) ? '/carlos/users/' + publisher + '/profpic-small.png' : '/carlos/views/res/default-user.jpg';

                var div = document.createElement('div');
                $(div).addClass('feed-card');
                $(div).append('<img class="post-profpic profpic" src="' + url + '">');
                $(div).append('<a class="profile-link">@' + publisher + '</a>');
                $(div).append('<p> - ' + postdate + '</p>');
                $(div).append('<div class="clear"></div>');
                $(div).append('<p class="content">' + content + '</p>');
                if(attatchments.length > 0) {
                    for (var src of attatchments) {
                        $(div).append('<img src="/carlos/posts_res/' + src + '" class="content-img">');
                    }
                }
                $(div).append('<table><tr><td><button class="img-button like-btn"><i class="fa fa-heart" aria-hidden="true"></i> <span class="post-likes"></span></button></td><td><button class="img-button"><i class="fa fa-mail-forward" aria-hidden="true"></i></button></td><td><button class="img-button"><i class="fa fa-comment" aria-hidden="true"></i></button></td></tr></table>');
                $(div).data('id', id);
                $('.feed').append(div);
                if(liked) $(div).find('.like-btn').addClass('liked');
                $(div).find('.post-likes').html((likes > 0) ? likes : '');
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

    $(document).on('focus', '.write-box textarea', function(){
        $('.write-box').addClass('focused');
    });

    $(document).on('click', function (e) {
        if(!$('.write-box').hasClass('focused')) return;
        var container = $('.write-box');

        var ex = $('.img-full');

        if ((!container.is(e.target) && container.has(e.target).length === 0) && (!ex.is(e.target) && ex.has(e.target).length === 0)) {
            $('.write-box').removeClass('focused');
        }
    });

});
