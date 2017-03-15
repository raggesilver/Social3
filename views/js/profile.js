var profile, username, fullname, name, surname, totalPosts, profilePic, isAdded = false;

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}

function setProfileInfo() {
    $('.self-fullname').html(fullname);
    $('.side-menu-username').text('@' + username);
    $('.side-menu-username').attr('href', '/carlos/?profile=' + username);
    $('.side-menu-totalposts').text(totalPosts + ' posts');

    $('.self-profpic-sm').attr('src', profilePic);
}

function getProfileInfo() {

    $.post({
        url: '/carlos/functions.php',
        data: 'func=getProfileInfo&profile=' + profile,
        success: function(_data) {

            // alert(_data);

            if(_data == "not found"){
                alert("User doesn't exixt!");
                window.location = '/carlos/';
            }

            data = JSON.parse(_data);
            username = data.username;
            fullname = data.fullname;
            name = data.fullname.split(' ')[0];
            surname = data.fullname.split(' ')[data.fullname.split(' ').length - 1];
            totalPosts = data.totalPosts;
            profilePic = data.profpic;

            var isMe = data.isMe;


            if(isMe === false) {
                $('table.self-profile').hide();
                isAdded = data.isAdded;
                if(isAdded === true) {
                    $('.add-friend-button').html('<i class="fa fa-user-times" aria-hidden="true"></i>');
                    $('.add-friend-button').attr('title', 'Remove Friend');
                    $('.add-friend-button').addClass('remove-friend');
                }
            } else {
                $('table.visit-profile').hide();
            }

            setProfileInfo();
            generateFeed();
        },
        error: function(err) {
            alert(err);
        }
    });

}

function generateFeed() {
    $.post({
        url: '/carlos/functions.php',
        data: 'func=generateProfileFeed&profile=' + profile,
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
                if(isShared) {
                    $(div).append('<a class="profile-link">@' + publisher + '</a><span class="profile-span"> &nbsp;shared&nbsp;</span>' + '<a class="profile-link">@' + originalPublisher + '</a><span class="profile-span">\'s</span><span class="profile-span">&nbsp;post</span>');
                } else {
                    $(div).append('<a class="profile-link">@' + publisher + '</a>');
                }
                $(div).append('<p> - ' + postdate + '</p>');
                $(div).append('<div class="clear"></div>');
                $(div).append('<p class="content">' + content + '</p>');
                if(attatchments.length > 0) {
                    for (var src of attatchments) {
                        $(div).append('<img src="/carlos/posts_res/' + src + '" class="content-img">');
                    }
                }
                $(div).append('<table><tr><td><button class="img-button like-btn"><i class="fa fa-heart" aria-hidden="true"></i><span class="post-likes"></span></button></td><td><button class="img-button share-button"><i class="fa fa-mail-forward" aria-hidden="true"></i></button></td><td><button class="img-button"><i class="fa fa-comment" aria-hidden="true"></i></button></td></tr></table>');
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

function addFriend(){
    $.post({
        url: '/carlos/functions.php',
        data: 'func=toggleFriendship&friend=' + username,
        success: function(data){alert(data); location.reload();},
        error: function(err){alert('error: ' + err);}
    });
}

function updateProfpic(profpicData) {

    var contentObj = JSON.stringify({
        'profpic': profpicData
    });

    $.post({
        url: '/carlos/functions.php',
        data: {
            'func': 'updateProfpic',
            'content': contentObj
        },
        success: function(data) {
            alert(data);
        },
        error: function(err) {
            alert(err);
        }
    });
}

$(function(){
    profile = getParameterByName('profile');
    getProfileInfo();
    // alert(profile);

    $(document).on('click', '.add-friend-button', function(){
        addFriend();
    });

    $(document).on('click', '.edit-profile', function(){

    });

    $(document).on('change', '.userUpdateInput', function(e){
        var files = e.target.files;
        var f = files[0];

        if (!f.type.match('image.*')) {
            alert('Please select an image');
            return;
        }

        var reader = new FileReader();

        reader.onload = (function(theFile) {
            return function(e) {
                updateProfpic(e.target.result);
            };

        })(f);

        reader.readAsDataURL(f);
    });

    $(document).on('click', 'button.edit-profile', function(){
        $('.userUpdateInput').click();
    });
});
