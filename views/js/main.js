var username, name, surname, fullname, selfpic, totalPosts;

var posting = false;

function UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}

function isURL(str) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test(str);
}

function setUserInfo() {
    console.log('set user info, ' + fullname);
    $('.self-fullname').html(fullname);
    $('.side-menu-username').text('@' + username);
    $('.side-menu-username').attr('href', '/carlos/?profile=' + username);
    $('.side-menu-totalposts').text(totalPosts + ' posts');

    var smalled = selfpic.split('.');

    var url = (UrlExists(smalled[0] + '-small' + smalled[1])) ? smalled[0] + '-small' + smalled[1] : selfpic;

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
            selfpic = data.profpic;

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

    posting = true;

    var mediaCount = $('.attatchFileInput').get(0).files.length;

    if (mediaCount == 1) {
        contentType = 'media';
    } else if (mediaCount > 1) {
        contentType = 'gallery'
    }

    var files = [];

    if (mediaCount > 0) {
        $('.preview-box span .thumb').each(function(index) {
            files.push($(this).attr('src'));
        });
    }

    var contentObj = JSON.stringify({
        'contentType': contentType,
        'content': content,
        'media': files,
        'sharing': false
    });

    // alert(contentObj);

    $.post({
        url: '/carlos/functions.php',
        data: {
            'func': 'post',
            'content': contentObj
        },
        beforeSend: function() {
            $('.publishButton').html('<i style="color:white" class="fa fa-circle-o-notch fa-spin fa-fw"></i>');
        },
        contentType: "application/x-www-form-urlencoded;charset=UTF-8",
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
                var isShared = post.isShared;
                var originalPublisher = post.originalPublisher;

                var type = contentObj.contentType;
                var content = contentObj.content;

                var attatchments = contentObj.attatchments;

                var profpic = post.profpic;

                var div = document.createElement('div');
                $(div).addClass('feed-card');
                $(div).append('<img class="post-profpic profpic" src="' + profpic + '">');
                if (isShared) {
                    $(div).append('<a class="profile-link">@' + publisher + '</a><span class="profile-span"> &nbsp;shared&nbsp;</span>' + '<a class="profile-link">@' + originalPublisher + '</a><span class="profile-span">\'s</span><span class="profile-span">&nbsp;post</span>');
                } else {
                    $(div).append('<a class="profile-link">@' + publisher + '</a>');
                }
                $(div).append('<p> - ' + postdate + '</p>');
                $(div).append('<button class="img-button post-control"><i class="fa fa-caret-down" aria-hidden="true"></i></button>');
                $(div).append('<div class="clear"></div>');

                var p = document.createElement('p');
                $(p).addClass('content');
                if (content.length <= 40 && attatchments.length == 0) $(p).addClass('big-font');

                var newContent = '';
                var contentArr = content.split(' ');

                for (var word of contentArr) {
                    if(isURL(word)) {
                        newContent += '<a class="content-link" href="' + word + '" target="_blank">' + word + '</a>&nbsp;';
                    } else newContent += word + '&nbsp;';
                }

                $(p).html(newContent);
                // $(div).append('<p class="content">' + content + '</p>');
                $(div).append(p);
                if (attatchments.length > 0) {
                    for (var src of attatchments) {
                        $(div).append('<img src="/carlos/posts_res/' + src + '" class="content-img">');
                    }
                }
                $(div).append('<table><tr><td><button class="img-button like-btn"><i class="fa fa-heart" aria-hidden="true"></i> <span class="post-likes"></span></button></td><td><button class="img-button share-button"><i class="fa fa-mail-forward" aria-hidden="true"></i></button></td><td><button class="img-button"><i class="fa fa-comment" aria-hidden="true"></i></button></td></tr></table>');
                $(div).data('id', id);
                $('.feed').append(div);
                if (liked) $(div).find('.like-btn').addClass('liked');
                $(div).find('.post-likes').html((likes > 0) ? likes : '');
            }
        },
        error: function(err) {
            alert(err);
        }
    });
}

function searchUser() {
    $.post({
        url: '/carlos/functions.php',
        data: 'func=search&search=' + $('#searchBar').val(),
        success: function(data) {
            var json = JSON.parse(data);
            for (var user of json) {
                alert(user.username);
            }
        }
    });
}

$(function() {

    getUserInfo();

    $(document).on('click', '.publishButton', function() {
        if(posting) return;
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
        if ($(this).val().length <= 50) {
            $(this).addClass('big-font');
        } else {
            $(this).removeClass('big-font');
        }
    });

    $(document).on('focus', '.write-box textarea', function() {
        $('.write-box').addClass('focused');
    });

    $(document).on('click', function(e) {
        if (!$('.write-box').hasClass('focused')) return;
        var container = $('.write-box');

        var ex = $('.img-full');

        if ((!container.is(e.target) && container.has(e.target).length === 0) && (!ex.is(e.target) && ex.has(e.target).length === 0)) {
            $('.write-box').removeClass('focused');
        }
    });

    $('.search-form').on('submit', function(e) {
        e.preventDefault();
        searchUser();
    });

});
